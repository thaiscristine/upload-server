import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  console.error(error)
  if (hasZodFastifySchemaValidationErrors(error)) {
    reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  } else {
    // Send the error to some observing tool as Sentry, Datadog, LogRocket, etc.
    reply.status(500).send({ error: 'Internal Server Error' })
  }
})

server.register(fastifyCors, { origin: '*' })
server.register(uploadImageRoute)

console.log(env.DATABASE_URL)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server is running')
})
