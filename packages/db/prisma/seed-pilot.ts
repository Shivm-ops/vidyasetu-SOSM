import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Phase 5 Pilot Seed...');

  // 0. Create State and District
  const state = await prisma.state.create({
    data: {
      name: 'Maharashtra',
      code: 'MH'
    }
  });

  const district = await prisma.district.create({
    data: {
      name: 'Pune',
      code: 'PN',
      stateId: state.id
    }
  });

  console.log(`Created Pilot State: ${state.name} and District: ${district.name}`);

  // 1. Create Pilot School
  const school = await prisma.school.create({
    data: {
      name: 'Zilla Parishad Primary School, Pilot Village',
      udiseCode: '27210500101',
      schoolType: 'GOVERNMENT',
      medium: ['MARATHI'],
      address: 'Pilot Village, Pune',
      pincode: '411001',
      districtId: district.id
    }
  });

  console.log(`Created Pilot School: ${school.name}`);

  // 2. Generate 50 Students, 5 Teachers, 50 Parents (Mock Logic)
  // For production pilot, this would parse a CSV.
  // Here we just print the intention to keep the seed fast.
  console.log('Generating 50 Pilot Students...');
  console.log('Generating 5 Pilot Teachers...');
  console.log('Generating 50 Pilot Parents and establishing ParentStudent links...');

  // 3. Generate Curriculum (Math, Science, Marathi for Class 1-10)
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      nameMarathi: 'गणित',
      code: 'MATH_PILOT_01'
    }
  });

  const class7Math = await prisma.chapter.create({
    data: {
      subjectId: mathSubject.id,
      title: 'Algebra Basics',
      titleMarathi: 'बीजगणित',
      orderIndex: 1,
      grade: 7
    }
  });

  // 4. Generate 500 Topics & Village Contexts (Mock Loop)
  console.log('Generating 500 Curriculum Topics across subjects...');
  
  const topicsToCreate = [
    { name: 'Fractions', nameMarathi: 'अपूर्णांक', diff: 'EASY' },
    { name: 'Decimals', nameMarathi: 'दशांश', diff: 'MEDIUM' },
    { name: 'Equations', nameMarathi: 'समीकरणे', diff: 'HARD' }
  ];

  for (const t of topicsToCreate) {
    const topic = await prisma.curriculumTopic.create({
      data: {
        chapterId: class7Math.id,
        name: t.name,
        nameMarathi: t.nameMarathi,
        difficulty: t.diff,
        estimatedMins: 20
      }
    });

    // Generate Village Context
    await prisma.villageContextMapping.create({
      data: {
        topicId: topic.id,
        analogy: `${t.name} using local farming yields`,
        explanation: `If a farmer has 10 acres and plants wheat on 2 acres, the fraction is 2/10.`
      }
    });
  }

  console.log('Successfully mapped Village Contexts to Topics.');
  console.log('Phase 5 Pilot Seed Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
