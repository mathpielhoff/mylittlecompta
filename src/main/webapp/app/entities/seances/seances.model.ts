import dayjs from 'dayjs/esm';
import { IPrestations } from 'app/entities/prestations/prestations.model';
import { IPatients } from 'app/entities/patients/patients.model';
import { IFactures } from 'app/entities/factures/factures.model';

export interface ISeances {
  id: string;
  place?: string | null;
  date?: dayjs.Dayjs | null;
  prestations?: Pick<IPrestations, 'id'> | null;
  patients?: Pick<IPatients, 'id'> | null;
  factures?: Pick<IFactures, 'id'> | null;
}

export type NewSeances = Omit<ISeances, 'id'> & { id: null };
