import Fastify from 'fastify';
import appointmentRoutes from './routes/appointment.routes';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

let fastify;

async function startServer() {
  if (!fastify) {
    fastify = Fastify();

    // Registrar Swagger
    fastify.register(fastifySwagger, {
      swagger: {
        info: {
          title: 'API de Citas',
          description: 'Documentación de la API de citas',
          version: '1.0.0',
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    // Registrar Swagger UI
    fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      staticCSP: true,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformSpecificationClone: true,
    });

    fastify.register(appointmentRoutes);
  }
}

startServer().then(() => {
  console.log('Server started');
});

export default fastify;
