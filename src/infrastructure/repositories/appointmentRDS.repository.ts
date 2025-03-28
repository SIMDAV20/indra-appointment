import mysql from 'mysql2/promise';
import { AppointmentDTO } from 'src/application/dtos/appointment.dto';

export class AppointmentRepositoryRDS {
  constructor(private readonly db: any) {}

  async save(appointment: AppointmentDTO) {
    const query = `INSERT INTO appointments (insuredId, scheduleId) VALUES (?, ?)`;
    await this.db.execute(query, [
      appointment.insuredId,
      appointment.scheduleId,
    ]);
    console.log(`💾 Guardado en MySQL: ${appointment.insuredId}`);
  }
}
