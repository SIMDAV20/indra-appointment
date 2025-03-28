import { FastifyInstance } from 'fastify';
import { AppointmentController } from '../controllers/appointment.controller';

async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.post('/appointments', AppointmentController.scheduleAppointment);
}

export default appointmentRoutes;
