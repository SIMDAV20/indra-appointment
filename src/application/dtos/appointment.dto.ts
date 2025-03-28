import { EnumCountries } from 'src/domain/enums/countries.enum';
import { z } from 'zod';

// Esquema de validación
export const AppointmentSchema = z.object({
  insuredId: z.string().min(1).regex(/^\d+$/, 'debe ser un número'), // Solo números
  scheduleId: z.number().int().positive(),
  countryISO: z.enum([EnumCountries.PE, EnumCountries.CL]),
});

export type AppointmentDTO = z.infer<typeof AppointmentSchema>;
