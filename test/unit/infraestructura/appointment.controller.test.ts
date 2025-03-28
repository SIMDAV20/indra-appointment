import fastify, { FastifyInstance } from 'fastify';
import { AppointmentController } from '../../../src/infrastructure/controllers/appointment.controller';
import { AppointmentService } from '../../../src/application/services/appointment.service';
import { AppointmentDTO } from '../../../src/application/dtos/appointment.dto';
import { ZodError } from 'zod';
import { EnumCountries } from 'src/domain/enums/countries.enum';

jest.mock('../../../src/application/services/appointment.service');

describe('AppointmentController', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    app.get('/appointment/:insuredId', AppointmentController.getAppointment);
    app.post('/appointments', AppointmentController.scheduleAppointment);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /appointment/:insuredId', () => {
    it('should return 200 and an appointment if found', async () => {
      (AppointmentService.getAppointment as jest.Mock).mockResolvedValue({
        insuredId: '00001',
        status: 'PENDING',
      });

      const response = await app.inject({
        method: 'GET',
        url: '/appointment/00001',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        insuredId: '00001',
        status: 'PENDING',
      });
    });

    it('should return 404 if appointment not found', async () => {
      (AppointmentService.getAppointment as jest.Mock).mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/appointment/00002',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Cita no encontrada' });
    });

    it('should return 500 if there is an internal error', async () => {
      (AppointmentService.getAppointment as jest.Mock).mockRejectedValue(
        new Error('DB Error'),
      );

      const response = await app.inject({
        method: 'GET',
        url: '/appointment/00003',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({
        message: 'Error interno del servidor',
      });
    });
  });

  describe('POST /appointments', () => {
    it('should return 200 when appointment is scheduled successfully', async () => {
      (AppointmentService.scheduleAppointment as jest.Mock).mockResolvedValue(
        undefined,
      );

      const appointmentData: AppointmentDTO = {
        insuredId: '123',
        scheduleId: 1,
        countryISO: EnumCountries.PE,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/appointments',
        payload: appointmentData,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        message: 'Cita agendada y enviada a SNS',
      });
    });

    it('should return 400 if validation fails', async () => {
      (AppointmentService.scheduleAppointment as jest.Mock).mockImplementation(
        () => {
          throw new ZodError([
            { code: 'custom', message: 'Datos inválidos', path: ['insuredId'] },
          ]);
        },
      );

      const response = await app.inject({
        method: 'POST',
        url: '/appointments',
        payload: {}, // Enviar datos inválidos
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('message', 'Datos inválidos');
    });

    it('should return 500 if service throws an error', async () => {
      (AppointmentService.scheduleAppointment as jest.Mock).mockRejectedValue(
        new Error('Service Error'),
      );

      const appointmentData: AppointmentDTO = {
        insuredId: '123',
        scheduleId: 1,
        countryISO: EnumCountries.PE,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/appointments',
        payload: appointmentData,
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ message: 'Service Error' });
    });
  });
});
