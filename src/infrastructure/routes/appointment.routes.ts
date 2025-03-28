import { FastifyInstance } from 'fastify';
import { AppointmentController } from '../controllers/appointment.controller';

async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.get('/appointments/:insuredId', {
    schema: {
      description: 'Obtiene todas las citas',
      tags: ['Appointments'],
      response: {
        200: {
          description: 'Lista de citas',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
    handler: AppointmentController.getAppointment,
  });
  fastify.post('/appointments', {
    schema: {
      description: 'Programa una nueva cita',
      tags: ['Appointments'],
      body: {
        type: 'object',
        required: ['id', 'status'],
        properties: {
          id: { type: 'string', description: 'ID de la cita' },
          status: { type: 'string', description: 'Estado de la cita' },
        },
      },
      response: {
        201: {
          description: 'Cita creada exitosamente',
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
    handler: AppointmentController.scheduleAppointment,
  });
}

export default appointmentRoutes;
