import dayjs from 'dayjs/esm';

import { IFactures, NewFactures } from './factures.model';

export const sampleWithRequiredData: IFactures = {
  id: '8abb7b61-3993-4022-839d-f0a1287bb1d3',
};

export const sampleWithPartialData: IFactures = {
  id: '8c803286-da59-4684-a62a-7609b863a55d',
  number: 'Espagne cross-media Somalie',
};

export const sampleWithFullData: IFactures = {
  id: '0d60de11-4197-44fe-a611-385233fde35c',
  number: 'Delesseux',
  emissionDate: dayjs('2022-11-21T23:24'),
  paidInvoice: false,
};

export const sampleWithNewData: NewFactures = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
