import { IPatients, NewPatients } from './patients.model';

export const sampleWithRequiredData: IPatients = {
  id: 'd00c53ae-885d-401e-b9cc-3593a1b94b57',
};

export const sampleWithPartialData: IPatients = {
  id: 'f00cea5d-efb7-4dec-b8e5-a3909fcdceea',
  firstName: 'Armine',
  lastName: 'Martinez',
  schoolClass: 'streamline',
};

export const sampleWithFullData: IPatients = {
  id: 'f8ba6e89-2b24-4938-90ea-36be45dad931',
  firstName: 'Adeline',
  lastName: 'Gauthier',
  age: 'internet Superviseur feed',
  schoolClass: 'TCP',
  school: 'Towels Granite',
};

export const sampleWithNewData: NewPatients = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
