import { EnumCountries } from '../enums/countries.enum';
import { EnumStatus } from '../enums/status.enum';

export class Appointment {
  constructor(
    public insuredId: string,
    public scheduleId: number,
    public countryISO: EnumCountries,
    public status: EnumStatus = EnumStatus.PENDING,
    public createdAt: Date = new Date(),
  ) {}
}
