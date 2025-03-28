import { EnumStatus } from 'src/domain/enums/status.enum';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { EventBridgeService } from '../../infrastructure/services/event-bridge.service';
import { Appointment } from 'src/domain/entities/appointment.entity';

export class ProcessAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private eventBridgeService: EventBridgeService,
  ) {}

  async execute(appointment: Appointment) {
    console.log(`🛠 Procesando appointment: ${appointment}`);

    // Guardar en MySQL
    await this.appointmentRepository.save(appointment);

    // Enviar evento a EventBridge
    await this.eventBridgeService.sendEvent({
      insuredId: appointment.insuredId,
      status: EnumStatus.COMPLETED,
    });

    console.log(`✅ Procesamiento finalizado para: ${appointment}`);
  }
}
