import dayjs from 'dayjs/esm';

import { ISeances, NewSeances } from './seances.model';

export const sampleWithRequiredData: ISeances = {
  id: '622af0af-e5b3-4b06-90f3-8b7771d4b799',
};

export const sampleWithPartialData: ISeances = {
  id: 'a1803391-afee-4164-9f7d-5d60fe371ef9',
};

export const sampleWithFullData: ISeances = {
  id: '40b2937e-824e-4d68-bb25-f24044c94030',
  place: 'Saint-Honoré Profound',
  date: dayjs('2022-11-21T19:53'),
};

export const sampleWithNewData: NewSeances = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
