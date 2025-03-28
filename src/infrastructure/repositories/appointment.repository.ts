import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { Appointment } from '../../domain/entities/appointment.entity';
import { dynamoDb } from '../config/dynamodb';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = 'AppointmentsTable';

export class AppointmentRepositoryDynamoDB implements AppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        createdAt: appointment.createdAt.toISOString(),
      },
    };

    await dynamoDb.send(new PutCommand(params));
    console.log('✅ Cita guardada en DynamoDB:', params.Item);
  }

  async find(insuredId: string): Promise<Appointment | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        insuredId,
      },
    };

    const result = await dynamoDb.send(new GetCommand(params));
    if (result.Item) {
      return new Appointment(
        result.Item.insuredId,
        result.Item.scheduleId,
        result.Item.countryISO,
        result.Item.status,
        new Date(result.Item.createdAt),
      );
    } else {
      return null;
    }
  }
}
