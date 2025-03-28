import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AppointmentDTO,
  AppointmentSchema,
} from 'src/application/dtos/appointment.dto';
import { AppointmentService } from 'src/application/services/appointment.service';
import { formatInsuredId } from 'src/domain/values-objects/insured-id';

export class AppointmentController {
  static async getAppointment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { insuredId } = req.params as { insuredId: string };
      const appointment = await AppointmentService.getAppointment(insuredId);

      if (!appointment) {
        return reply.status(404).send({ message: 'Cita no encontrada' });
      }

      return reply.status(200).send(appointment);
    } catch (error) {
      console.error('Error en AppointmentController:', error);
      return reply.status(500).send({ message: 'Error interno del servidor' });
    }
  }

  static async scheduleAppointment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData: AppointmentDTO = AppointmentSchema.parse(req.body);

      validatedData.insuredId = formatInsuredId(validatedData.insuredId);
      await AppointmentService.scheduleAppointment(validatedData);

      reply.send({ message: 'Cita agendada y enviada a SNS' });
    } catch (error) {
      console.error('Error en el controlador:', error);

      if (error instanceof Error && error.name === 'ZodError') {
        return reply
          .status(400)
          .send({ message: 'Datos inválidos', details: (error as any).errors });
      }

      return reply.status(500).send({
        message:
          (error instanceof Error ? error.message : 'Error desconocido') ||
          'Error al agendar la cita',
      });
    }
  }
}
