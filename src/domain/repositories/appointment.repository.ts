import { Appointment } from '../entities/appointment.entity';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}
