import { FastifyInstance } from 'fastify';

export default async function intelligenceRoutes(fastify: FastifyInstance) {
  const authenticate = { preHandler: [fastify.authenticate] };

  // =============================================================================
  // PHASE 3: LEARNING INTELLIGENCE ENGINE & KNOWLEDGE GRAPH
  // =============================================================================

  // GET /v1/intelligence/learning-index
  fastify.get('/learning-index', authenticate, async (request, reply) => {
    const { studentId } = request.query as { studentId: string };
    if (!studentId) return reply.code(400).send({ success: false, message: "studentId required" });

    // 1. Fetch Mastery
    const masteries = await fastify.prisma.studentConceptMastery.findMany({ where: { studentId } });
    const avgMastery = masteries.length ? masteries.reduce((acc, m) => acc + m.masteryScore, 0) / masteries.length : 0;
    
    // 2. Fetch Quiz Performance
    const progress = await fastify.prisma.studentProgress.findMany({ where: { studentId } });
    const avgQuizScore = progress.length ? progress.reduce((acc, p) => acc + (p.avgScore || 0), 0) / progress.length : 0;
    
    // 3. Activity & Project Mocks (Since we don't have explicit activity completion tracking yet)
    const activityCompletionRate = 75; // Mock
    const projectCompletionRate = 50; // Mock

    // Formula: (Avg Concept Mastery %) * 0.4 + (Avg Quiz Score) * 0.3 + (Activity Rate) * 0.15 + (Project Rate) * 0.15
    const learningIndex = (avgMastery * 0.4) + (avgQuizScore * 0.3) + (activityCompletionRate * 0.15) + (projectCompletionRate * 0.15);

    return reply.send({
      success: true,
      data: {
        learningIndex: Math.round(learningIndex),
        skillReadinessIndex: 45,
        careerReadinessIndex: 60,
        innovationIndex: 30,
        communityImpactIndex: 50,
      }
    });
  });

  // GET /v1/intelligence/recommendations
  fastify.get('/recommendations', authenticate, async (request, reply) => {
    const { studentId } = request.query as { studentId: string };
    
    // Graph Traversal Logic
    // Find weak concepts -> Map to activities/quizzes.
    const weakMasteries = await fastify.prisma.studentConceptMastery.findMany({
      where: { studentId, status: { in: ['NOT_STARTED', 'LEARNING'] } },
      include: { concept: true },
      take: 3
    });

    const recommendations = weakMasteries.map(wm => ({
      type: "CONCEPT_PRACTICE",
      title: `Practice ${wm.concept.name}`,
      reason: "Weak concept detected.",
      actionUrl: `/learning-os/concept/${wm.conceptId}`
    }));

    // Add career/village recommendations based on interests (Graph Traversal mock)
    recommendations.push({
      type: "VILLAGE_PROJECT",
      title: "Water Conservation Model",
      reason: "Matches your interest in Agriculture.",
      actionUrl: `/village/projects`
    });

    return reply.send({ success: true, data: recommendations });
  });

  // GET /v1/intelligence/career-dna
  fastify.get('/career-dna', authenticate, async (request, reply) => {
    const { studentId } = request.query as { studentId: string };

    let dna = await fastify.prisma.careerDNAProfile.findUnique({ where: { studentId } });
    if (!dna) {
      // Create mock DNA profile if not exists
      dna = await fastify.prisma.careerDNAProfile.create({
        data: {
          studentId,
          interests: ["Technology", "Environment"],
          topSkillIds: [],
          calculatedCareers: ["Software Engineer", "Environmental Scientist", "Agritech Founder", "Data Analyst", "Civil Engineer"]
        }
      });
    }

    return reply.send({
      success: true,
      data: {
        interests: dna.interests,
        topCareers: dna.calculatedCareers
      }
    });
  });

  // POST /v1/intelligence/mastery/update (Matches user requirement)
  fastify.post('/mastery/update', authenticate, async (request, reply) => {
    const { studentId, conceptId, status, masteryScore } = request.body as any;
    
    const mastery = await fastify.prisma.studentConceptMastery.upsert({
      where: { studentId_conceptId: { studentId, conceptId } },
      update: { status, masteryScore },
      create: { studentId, conceptId, status, masteryScore }
    });

    // Check Chapter Hard Gate Logic
    const chapter = await fastify.prisma.concept.findUnique({
      where: { id: conceptId },
      select: { chapterId: true }
    });

    const allConceptsInChapter = await fastify.prisma.concept.findMany({
      where: { chapterId: chapter!.chapterId }
    });

    const studentMasteries = await fastify.prisma.studentConceptMastery.findMany({
      where: { studentId, conceptId: { in: allConceptsInChapter.map(c => c.id) } }
    });

    const isChapterMastered = allConceptsInChapter.every(c => {
      const m = studentMasteries.find(sm => sm.conceptId === c.id);
      return m && m.status === 'MASTERED';
    });

    return reply.send({
      success: true,
      data: {
        mastery,
        isChapterMastered,
        message: isChapterMastered ? "Chapter unlocked!" : "Keep practicing to unlock the next chapter."
      }
    });
  });

  fastify.post('/learning-recovery', async (request, reply) => {
    // 1. Fetch student performance from DB
    // 2. Call AI Service: POST http://vidyasetu-ai:8000/api/v1/intelligence/learning-recovery
    // 3. Save recovery plan to LearningIntelligenceProfile
    
    return {
      success: true,
      message: "Adaptive learning recovery plan generated.",
      data: {
        weak_concepts: ["Fractions", "Decimals"],
        strong_concepts: ["Addition", "Multiplication"],
        learning_velocity: 0.8,
        recovery_plan: {
          daily_missions: ["Practice 10 Fractions questions", "Practice 10 Decimals questions"],
          recommended_lessons: ["Basic Fractions Video", "Decimal Division Interactive"]
        }
      }
    };
  });

  fastify.post('/daily-briefing', async (request, reply) => {
    // 1. Fetch student's 5-pillar Growth Engine stats from frontend store (via body)
    // 2. Call AI Service: POST http://vidyasetu-ai:8000/api/v1/intelligence/daily-briefing
    
    return {
      success: true,
      message: "Daily briefing generated.",
      data: {
        briefing_text: "नमस्कार! तू सध्या Growing लेव्हल वर आहेस. आज आपण 'कौशल्ये (Skills)' मध्ये प्रगती करूया. आजची मिशन पूर्ण करून तुझी लेव्हल वाढव!",
        focus_area: "कौशल्ये (Skills)"
      }
    };
  });

  fastify.post('/career-match', async (request, reply) => {
    // 1. Fetch Student's Learning & Skill scores
    // 2. Call AI Service
    // 3. Save to DreamCareer table
    
    return {
      success: true,
      data: {
        career_matches: [
          {
            career: "Agriculture Scientist",
            match_score: 92,
            reason: "Strong interest in nature and high science learning scores."
          }
        ]
      }
    };
  });

  fastify.post('/project-builder', async (request, reply) => {
    // 1. Take problem from student
    // 2. Call AI Service
    // 3. Save to AIProject table
    
    return {
      success: true,
      data: {
        project: {
          problem: "Water Problem",
          solution: "Low-cost water filter using charcoal, sand, and pebbles.",
          plan_steps: ["Gather materials", "Cut bottle", "Test"],
          impact_metrics: ["Litres purified"]
        }
      }
    };
  });

  fastify.post('/voice-report', async (request, reply) => {
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const jwtToken = fastify.jwt.sign({ service: 'vidyasetu-api' });

      const response = await fetch(`${aiUrl}/api/v1/intelligence/voice-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(request.body)
      });

      if (!response.ok) throw new Error(`AI Service returned ${response.status}`);
      const data = await response.json();
      
      return { success: true, data };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: "Voice Report service is unavailable." });
    }
  });

  // AI Tutor Proxy
  fastify.post('/tutor/chat', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const jwtToken = fastify.jwt.sign({ service: 'vidyasetu-api' });

      const response = await fetch(`${aiUrl}/api/v1/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(request.body)
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: "AI Mentor service is unavailable." });
    }
  });

  // Teacher Assistant Proxy
  fastify.post('/teacher-assistant', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const jwtToken = fastify.jwt.sign({ service: 'vidyasetu-api' });

      const response = await fetch(`${aiUrl}/api/v1/intelligence/teacher-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(request.body)
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: "Teacher Assistant service is unavailable." });
    }
  });

  // Quiz Generator Proxy
  fastify.post('/generate-quiz', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const jwtToken = fastify.jwt.sign({ service: 'vidyasetu-api' });

      const response = await fetch(`${aiUrl}/api/v1/tutor/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(request.body)
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: "Quiz Generator service is unavailable." });
    }
  });
}
