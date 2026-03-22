import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        body: z.object({
          name: z.string().min(2).max(100).describe('The name of the image'),
          password: z
            .string()
            .optional()
            .describe('The password for the image'),
          file: z.string().min(1).max(100).describe('The image file to upload'),
        }),
        response: {
          201: z.object({
            uploadId: z.string().describe('The ID of the uploaded image'),
          }),
          409: z.object({
            message: z.string().describe('Upload already exists'),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({ uploadId: '12345' })
    }
  )
}
