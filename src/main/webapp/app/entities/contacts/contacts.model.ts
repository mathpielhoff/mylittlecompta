import { IPatients } from 'app/entities/patients/patients.model';
import { RelationType } from 'app/entities/enumerations/relation-type.model';

export interface IContacts {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  relationType?: RelationType | null;
  patients?: Pick<IPatients, 'id'> | null;
}

export type NewContacts = Omit<IContacts, 'id'> & { id: null };
