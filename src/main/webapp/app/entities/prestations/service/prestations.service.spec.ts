import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPrestations } from '../prestations.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prestations.test-samples';

import { PrestationsService } from './prestations.service';

const requireRestSample: IPrestations = {
  ...sampleWithRequiredData,
};

describe('Prestations Service', () => {
  let service: PrestationsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPrestations | IPrestations[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PrestationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Prestations', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const prestations = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prestations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prestations', () => {
      const prestations = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prestations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prestations', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prestations', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Prestations', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPrestationsToCollectionIfMissing', () => {
      it('should add a Prestations to an empty array', () => {
        const prestations: IPrestations = sampleWithRequiredData;
        expectedResult = service.addPrestationsToCollectionIfMissing([], prestations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prestations);
      });

      it('should not add a Prestations to an array that contains it', () => {
        const prestations: IPrestations = sampleWithRequiredData;
        const prestationsCollection: IPrestations[] = [
          {
            ...prestations,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPrestationsToCollectionIfMissing(prestationsCollection, prestations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prestations to an array that doesn't contain it", () => {
        const prestations: IPrestations = sampleWithRequiredData;
        const prestationsCollection: IPrestations[] = [sampleWithPartialData];
        expectedResult = service.addPrestationsToCollectionIfMissing(prestationsCollection, prestations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prestations);
      });

      it('should add only unique Prestations to an array', () => {
        const prestationsArray: IPrestations[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const prestationsCollection: IPrestations[] = [sampleWithRequiredData];
        expectedResult = service.addPrestationsToCollectionIfMissing(prestationsCollection, ...prestationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prestations: IPrestations = sampleWithRequiredData;
        const prestations2: IPrestations = sampleWithPartialData;
        expectedResult = service.addPrestationsToCollectionIfMissing([], prestations, prestations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prestations);
        expect(expectedResult).toContain(prestations2);
      });

      it('should accept null and undefined values', () => {
        const prestations: IPrestations = sampleWithRequiredData;
        expectedResult = service.addPrestationsToCollectionIfMissing([], null, prestations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prestations);
      });

      it('should return initial array if no Prestations is added', () => {
        const prestationsCollection: IPrestations[] = [sampleWithRequiredData];
        expectedResult = service.addPrestationsToCollectionIfMissing(prestationsCollection, undefined, null);
        expect(expectedResult).toEqual(prestationsCollection);
      });
    });

    describe('comparePrestations', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePrestations(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.comparePrestations(entity1, entity2);
        const compareResult2 = service.comparePrestations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.comparePrestations(entity1, entity2);
        const compareResult2 = service.comparePrestations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.comparePrestations(entity1, entity2);
        const compareResult2 = service.comparePrestations(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
