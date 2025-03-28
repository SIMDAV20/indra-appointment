import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AppointmentDTO,
  AppointmentSchema,
} from 'src/application/dtos/appointment.dto';
import { AppointmentService } from 'src/application/services/appointment.service';
import { formatInsuredId } from 'src/domain/values-objects/insured-id';

export class AppointmentController {
  static async scheduleAppointment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData: AppointmentDTO = AppointmentSchema.parse(req.body);

      // Formatear insuredId para que tenga 5 dígitos con ceros a la izquierda
      validatedData.insuredId = formatInsuredId(validatedData.insuredId);
      await AppointmentService.scheduleAppointment(validatedData);

      reply.send({ message: 'Cita agendada y enviada a SNS' });
    } catch (error) {
      console.error('Error en el controlador:', error);

      // Si el error viene de la validación de Zod
      if (error instanceof Error && error.name === 'ZodError') {
        return reply
          .status(400)
          .send({ message: 'Datos inválidos', details: (error as any).errors });
      }

      // Si el error viene del servicio
      return reply.status(500).send({
        message:
          (error instanceof Error ? error.message : 'Error desconocido') ||
          'Error al agendar la cita',
      });
    }
  }
}
