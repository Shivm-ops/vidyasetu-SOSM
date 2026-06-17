import { PrismaClient } from '@prisma/client';

export async function importCurriculum(payload: any, prisma: PrismaClient) {
  let stats = {
    chapters: 0,
    concepts: 0,
    graphEdges: 0
  };

  for (const classData of payload.classes) {
    const grade = classData.grade;
    
    for (const subjectData of classData.subjects) {
      // Upsert Subject
      const subject = await prisma.subject.upsert({
        where: { code: subjectData.code },
        update: {
          name: subjectData.name,
          iconUrl: subjectData.iconUrl,
          grade
        },
        create: {
          code: subjectData.code,
          name: subjectData.name,
          iconUrl: subjectData.iconUrl,
          grade
        }
      });

      for (const chapterData of subjectData.chapters) {
        // Upsert Chapter
        const chapter = await prisma.chapter.create({
          data: {
            subjectId: subject.id,
            title: chapterData.title,
            summary: chapterData.summary,
            learningObjectives: chapterData.learningObjectives || [],
            keywords: chapterData.keywords || [],
            difficultyLevel: chapterData.difficultyLevel || "MEDIUM",
            orderIndex: chapterData.orderIndex || 1,
            grade
          }
        });
        stats.chapters++;

        for (const conceptData of chapterData.concepts) {
          // Create Concept
          const concept = await prisma.concept.create({
            data: {
              chapterId: chapter.id,
              name: conceptData.name,
              explanation: conceptData.explanation,
              realLifeExample: conceptData.realLifeExample,
              villageExample: conceptData.villageExample,
            }
          });
          stats.concepts++;

          // Graph Mappings

          // Activities
          if (conceptData.activities) {
            for (const act of conceptData.activities) {
              await prisma.conceptActivity.create({
                data: {
                  conceptId: concept.id,
                  activityRef: act.title
                }
              });
              stats.graphEdges++;
            }
          }

          // Skills
          if (conceptData.skills) {
            for (const skill of conceptData.skills) {
              // Upsert SkillPath
              const skillPath = await prisma.skillPath.create({
                data: {
                  name: skill.name,
                  description: skill.description
                }
              });
              
              await prisma.conceptSkillMapping.create({
                data: {
                  conceptId: concept.id,
                  skillPathId: skillPath.id
                }
              });
              stats.graphEdges++;
            }
          }

          // Careers
          if (conceptData.careers && conceptData.skills) {
            // Find just created skill
            const skillPath = await prisma.skillPath.findFirst({
              where: { name: conceptData.skills[0].name }
            });
            
            if (skillPath) {
              for (const career of conceptData.careers) {
                const careerPath = await prisma.careerPath.create({
                  data: {
                    title: career.name,
                    category: career.category || "OTHER",
                    description: career.description || "",
                    incomeRange: "₹3 LPA - ₹10 LPA",
                    futureScope: "High"
                  }
                });

                await prisma.skillCareerMapping.create({
                  data: {
                    skillPathId: skillPath.id,
                    careerPathId: careerPath.id,
                    relevance: 1.0
                  }
                });
                stats.graphEdges++;
              }
            }
          }

          // Projects (Village or Innovation)
          if (conceptData.projects) {
            for (const proj of conceptData.projects) {
              const template = await prisma.villageProjectTemplate.create({
                data: {
                  title: proj.title,
                  description: "Village project related to " + concept.name,
                  impactPoints: 500
                }
              });
              stats.graphEdges++;
            }
          }
        }
      }
    }
  }

  return stats;
}
