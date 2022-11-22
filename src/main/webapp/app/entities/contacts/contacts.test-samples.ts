import { RelationType } from 'app/entities/enumerations/relation-type.model';

import { IContacts, NewContacts } from './contacts.model';

export const sampleWithRequiredData: IContacts = {
  id: '32bf37de-0b11-48e5-92ea-5bb7f909a928',
};

export const sampleWithPartialData: IContacts = {
  id: '59e1aae5-d59f-4ffd-b873-9f4d217113ea',
  firstName: 'Aquiline',
  lastName: 'Roux',
  relationType: RelationType['MERE'],
};

export const sampleWithFullData: IContacts = {
  id: '6852cc91-f009-40ed-8401-d4b23e92d607',
  firstName: 'Gaël',
  lastName: 'Da silva',
  phoneNumber: 'Licensed Languedoc-Roussillon',
  address: 'Administrateur Generic',
  relationType: RelationType['MERE'],
};

export const sampleWithNewData: NewContacts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
