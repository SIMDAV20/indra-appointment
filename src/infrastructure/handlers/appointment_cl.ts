import { AppointmentService } from '../../application/services/appointment.service';
import { Appointment } from 'src/domain/entities/appointment.entity';

export const handler = async (event: any) => {
  try {
    for (const record of event.Records) {
      const message: Appointment = JSON.parse(record.body);

      console.log(`📩 Recibido mensaje de SQS:`, message);

      await AppointmentService.processAppointment(message, message.countryISO);
    }
  } catch (error) {
    console.error('❌ Error en el handler:', error);
  }
};
