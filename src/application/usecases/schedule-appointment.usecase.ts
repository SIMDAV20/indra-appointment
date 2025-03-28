import { EnumCountries } from 'src/domain/enums/countries.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { SNSService } from '../../infrastructure/services/sns.service';

export class ScheduleAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private snsService: SNSService,
  ) {}

  async execute(
    insuredId: string,
    scheduleId: number,
    countryISO: EnumCountries,
  ): Promise<void> {
    const appointment = new Appointment(insuredId, scheduleId, countryISO);
    await this.appointmentRepository.save(appointment);
    console.log('🚀 ~ ScheduleAppointmentUseCase ~ appointment:', appointment);

    const topicArn = 'arn:aws:sns:us-east-1:613859881893:RoutingSNSTopic';

    await this.snsService.publishMessage(
      topicArn,
      appointment,
      appointment.countryISO,
    );
    console.log('🚀 paso el msg');
  }
}
