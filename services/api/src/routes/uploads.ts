import { FastifyInstance } from "fastify";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const presignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.enum(["profiles", "content", "homework", "documents"]),
});

export async function uploadRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // GET presigned URL for direct S3 upload from client
  app.post("/presign", authenticate, async (request, reply) => {
    const body = presignSchema.parse(request.body);

    const ALLOWED_MIME_TYPES: Record<string, string[]> = {
      profiles: ["image/jpeg", "image/png", "image/webp"],
      content: ["video/mp4", "application/pdf", "audio/mpeg", "audio/mp4"],
      homework: ["image/jpeg", "image/png", "application/pdf"],
      documents: ["application/pdf", "image/jpeg", "image/png"],
    };

    const allowed = ALLOWED_MIME_TYPES[body.folder] ?? [];
    if (!allowed.includes(body.contentType)) {
      return reply.code(400).send({
        success: false,
        message: `Content type ${body.contentType} not allowed in folder ${body.folder}`,
      });
    }

    const ext = body.filename.split(".").pop();
    const key = `${body.folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: body.contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `${process.env.S3_CDN_URL}/${key}`;

    return reply.send({
      success: true,
      data: { uploadUrl: signedUrl, publicUrl, key },
    });
  });
}
