import Fastify from 'fastify';
import appointmentRoutes from './routes/appointment.routes';

let fastify;

async function startServer() {
  if (!fastify) {
    fastify = Fastify();
    fastify.register(appointmentRoutes);
  }
}

startServer().then(() => {
  console.log('Server started');
});
export default fastify;
