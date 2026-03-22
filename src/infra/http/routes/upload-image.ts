import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post('/uploads', async (request, reply) => {
    const data = request.body
    reply.send({ message: 'Image uploaded successfully', data })
  })
}
