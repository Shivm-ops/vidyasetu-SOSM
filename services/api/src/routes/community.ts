import { FastifyInstance } from "fastify";
import { z } from "zod";

const createPostSchema = z.object({
  vlcId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  imageUrl: z.string().url().optional(),
});

export async function communityRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/vlc", authenticate, async (request, reply) => {
    const { villageId } = request.query as { villageId?: string };

    const circles = await app.prisma.villageLearningCircle.findMany({
      where: { ...(villageId && { villageId }) },
      include: {
        village: { select: { name: true, nameMarathi: true } },
        _count: { select: { members: true, posts: true } },
      },
    });

    return reply.send({ success: true, data: circles });
  });

  app.get("/vlc/:id/posts", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const posts = await app.prisma.communityPost.findMany({
      where: { vlcId: id },
      include: {
        author: {
          select: { firstName: true, lastName: true, firstNameMarathi: true, profilePhotoUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return reply.send({ success: true, data: posts });
  });

  app.post("/posts", authenticate, async (request, reply) => {
    const body = createPostSchema.parse(request.body);

    const post = await app.prisma.communityPost.create({
      data: {
        vlcId: body.vlcId,
        authorId: request.user!.userId,
        content: body.content,
        imageUrl: body.imageUrl,
      },
    });

    return reply.code(201).send({ success: true, data: post });
  });

  app.get("/mentors", authenticate, async (request, reply) => {
    const { expertise } = request.query as { expertise?: string };

    const mentors = await app.prisma.mentor.findMany({
      where: {
        isAvailable: true,
        ...(expertise && { expertise: { has: expertise } }),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            firstNameMarathi: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    return reply.send({ success: true, data: mentors });
  });
}
