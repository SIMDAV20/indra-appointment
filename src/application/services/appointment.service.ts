import { ScheduleAppointmentUseCase } from '../../application/usecases/schedule-appointment.usecase';
import { AppointmentRepositoryDynamoDB } from './../../infrastructure/repositories/appointment.repository';
import { SNSService } from '../../infrastructure/services/sns.service';

import { AppointmentDTO } from '../dtos/appointment.dto';
import { ProcessAppointmentUseCase } from '../usecases/process-appointment.usecase';
import { AppointmentRepositoryRDS } from 'src/infrastructure/repositories/appointmentRDS.repository';
import { EventBridgeService } from 'src/infrastructure/services/event-bridge.service';
import { EnumCountries } from 'src/domain/enums/countries.enum';
import poolCl from 'src/infrastructure/config/mysqldb_cl';
import poolPe from 'src/infrastructure/config/mysqldb_pe';
import { Appointment } from 'src/domain/entities/appointment.entity';

const appointmentRepository = new AppointmentRepositoryDynamoDB();
const snsService = new SNSService();
const scheduleAppointmentUseCase = new ScheduleAppointmentUseCase(
  appointmentRepository,
  snsService,
);

const eventBridgeService = new EventBridgeService();

export class AppointmentService {
  static async getAppointment(insuredId: string) {
    try {
      const appointment = await appointmentRepository.find(insuredId);
      if (!appointment) {
        console.log(`No se encontró cita para insuredId: ${insuredId}`);
      }

      return appointment;
    } catch (error) {
      console.error('Error en el servicio AppointmentService:', error);
      throw new Error('No se pudo obtener la cita');
    }
  }

  static async scheduleAppointment(scheduleAppointmentDTO: AppointmentDTO) {
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

  static async processAppointment(
    appointment: Appointment,
    countryISO: string,
  ) {
    try {
      const db = countryISO === EnumCountries.PE ? poolPe : poolCl;
      const appointmentRepositoryRDS = new AppointmentRepositoryRDS(db);

      const processAppointmentUseCase = new ProcessAppointmentUseCase(
        appointmentRepositoryRDS,
        eventBridgeService,
      );

      await processAppointmentUseCase.execute(appointment);
    } catch (error) {
      console.error('Error en el servicio AppointmentService:', error);
      throw new Error('No se pudo procesar la cita');
    }
  }
}
