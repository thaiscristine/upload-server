import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadImage } from '@/app/functions/upload-image'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        // body: z.object({
        //   name: z.string().min(2).max(100).describe('The name of the image'),
        //   password: z
        //     .string()
        //     .optional()
        //     .describe('The password for the image'),
        //   file: z.string().min(1).max(100).describe('The image file to upload'),
        // }),
        response: {
          201: z.object({
            uploadId: z.string().describe('The ID of the uploaded image'),
          }),
          400: z.object({
            message: z.string().describe('File is required'),
          }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 2 * 1024 * 1024, // 2MB
        },
      })

      if(!uploadedFile) {
        return reply.status(400).send({ message: 'File is required' })
      }

      await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      await db.insert(schema.uploads).values({
        name: 'testing 123.jpg',
        remoteKey: 'aaa.jpg',
        remoteUrl: `https://example.com/uploads/aaa.jpg`,
      })
      return reply.status(201).send({ uploadId: '12345' })
    }
  )
}
