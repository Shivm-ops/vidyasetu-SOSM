import { FastifyInstance } from 'fastify';

export default async function knowledgeRoutes(fastify: FastifyInstance) {
  
  fastify.post('/knowledge/teach-topic', async (request, reply) => {
    // 1. Fetch CurriculumTopic from DB
    // 2. Check if AITeachingContent already exists (Caching)
    // 3. If not, call AI Service: POST http://vidyasetu-ai:8000/api/v1/knowledge/teach-topic
    // 4. Save to AITeachingContent and VillageContextMapping
    
    // Mocking response for architecture outline
    return {
      success: true,
      message: "Topic teaching content retrieved.",
      data: {
        simple_explanation: "प्रकाशसंश्लेषण म्हणजे वनस्पती स्वतःचे अन्न तयार करण्याची प्रक्रिया.",
        story_based: "एका छोट्याशा गावात एक आंब्याचे झाड होते...",
        village_context: "जसे आपण चुलीवर स्वयंपाक करतो, तसेच Sugarcane पानांमध्ये स्वयंपाक करतात.",
        real_life_examples: ["उसाची शेती", "घरातील कुंडीतील रोप"],
        visual_prompts: ["सूर्यप्रकाश पानावर पडतानाचे चित्र"],
        practice_questions: [
            {"q": "वनस्पती अन्न कुठे तयार करतात?", "a": "पानांमध्ये"}
        ],
        quiz_questions: [
            {"q": "प्रकाशसंश्लेषणासाठी काय आवश्यक आहे?", "options": ["सूर्यप्रकाश", "माती", "खत"], "answer": "सूर्यप्रकाश"}
        ],
        activities: ["एका पानाला काळ्या कागदाने झाकून ठेवा आणि ३ दिवसांनी पहा."],
        project_ideas: ["वनस्पती आणि सूर्यप्रकाश यावर प्रयोग करणे."]
      }
    };
  });

  fastify.post('/knowledge/career-explorer', async (request, reply) => {
    // 1. Fetch CareerProfiles from DB, fallback to AI Service if empty
    return {
      success: true,
      data: {
        careers: [
            {
                "title": "Agriculture Scientist (कृषी शास्त्रज्ञ)",
                "category": "Agriculture",
                "income_range": "₹4L - ₹12L per year",
                "education": ["B.Sc Agriculture", "M.Sc Agriculture"],
                "skills": ["Research", "Biology", "Soil Analysis"]
            }
        ]
      }
    };
  });

  fastify.post('/knowledge/scholarship-finder', async (request, reply) => {
    // 1. Evaluate Student Profile against ScholarshipProfile rules
    return {
      success: true,
      data: {
        matches: [
            {
                "name": "MahaDBT Post Matric Scholarship",
                "eligibility": "Income < ₹2.5L",
                "deadline": "2024-12-31",
                "required_docs": ["Income Certificate", "Caste Certificate", "Aadhaar"]
            }
        ]
      }
    };
  });

  fastify.post('/knowledge/recommend', async (request, reply) => {
    // 1. Fetch Student performance
    // 2. Query TopicDependency graph using Prisma to find next/previous nodes
    // 3. Ask AI Service to make the final determination
    return {
      success: true,
      data: {
        action: "RECOVERY",
        recommended_topic: "Fractions Basics",
        reason: "Before moving forward, let's strengthen the foundation."
      }
    };
  });
}
