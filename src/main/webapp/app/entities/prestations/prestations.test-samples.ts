import { IPrestations, NewPrestations } from './prestations.model';

export const sampleWithRequiredData: IPrestations = {
  id: '485eee88-aee1-49bd-98d1-f53d34264f2f',
};

export const sampleWithPartialData: IPrestations = {
  id: '2e979bb6-0ca8-4ac2-81ed-fd921d91cc39',
  minutesDuration: '77661',
  price: 67985,
};

export const sampleWithFullData: IPrestations = {
  id: '39da5d87-6e7a-436e-a0cd-e854d9d69837',
  label: 'Buckinghamshire c',
  minutesDuration: '30682',
  price: 16778,
};

export const sampleWithNewData: NewPrestations = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
