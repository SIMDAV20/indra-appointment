import { ScheduleAppointmentUseCase } from '../../application/usecases/schedule-appointment.usecase';
import { AppointmentRepositoryDynamoDB } from './../../infrastructure/repositories/appointment.repository';
import { SNSService } from '../../infrastructure/services/sns.service';

import { ScheduleAppointmentDTO } from '../dtos/appointment.dto';

const appointmentRepository = new AppointmentRepositoryDynamoDB();
const snsService = new SNSService();
const scheduleAppointmentUseCase = new ScheduleAppointmentUseCase(
  appointmentRepository,
  snsService,
);

export class AppointmentService {
  static async scheduleAppointment(
    scheduleAppointmentDTO: ScheduleAppointmentDTO,
  ) {
    try {
      const { insuredId, scheduleId, countryISO } = scheduleAppointmentDTO;

      await scheduleAppointmentUseCase.execute(
        insuredId,
        scheduleId,
        countryISO,
      );
    } catch (error) {
      console.error('Error en el servicio AppointmentService:', error);
      throw new Error('No se pudo agendar la cita');
    }
  }
}
