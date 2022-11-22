import dayjs from 'dayjs/esm';
import { IContacts } from 'app/entities/contacts/contacts.model';

export interface IFactures {
  id: string;
  number?: string | null;
  emissionDate?: dayjs.Dayjs | null;
  paidInvoice?: boolean | null;
  contacts?: Pick<IContacts, 'id'> | null;
}

export type NewFactures = Omit<IFactures, 'id'> & { id: null };
