import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeances } from '../seances.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../seances.test-samples';

import { SeancesService, RestSeances } from './seances.service';

const requireRestSample: RestSeances = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Seances Service', () => {
  let service: SeancesService;
  let httpMock: HttpTestingController;
  let expectedResult: ISeances | ISeances[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SeancesService);
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

    it('should create a Seances', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const seances = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(seances).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Seances', () => {
      const seances = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(seances).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Seances', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Seances', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Seances', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSeancesToCollectionIfMissing', () => {
      it('should add a Seances to an empty array', () => {
        const seances: ISeances = sampleWithRequiredData;
        expectedResult = service.addSeancesToCollectionIfMissing([], seances);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seances);
      });

      it('should not add a Seances to an array that contains it', () => {
        const seances: ISeances = sampleWithRequiredData;
        const seancesCollection: ISeances[] = [
          {
            ...seances,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSeancesToCollectionIfMissing(seancesCollection, seances);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Seances to an array that doesn't contain it", () => {
        const seances: ISeances = sampleWithRequiredData;
        const seancesCollection: ISeances[] = [sampleWithPartialData];
        expectedResult = service.addSeancesToCollectionIfMissing(seancesCollection, seances);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seances);
      });

      it('should add only unique Seances to an array', () => {
        const seancesArray: ISeances[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const seancesCollection: ISeances[] = [sampleWithRequiredData];
        expectedResult = service.addSeancesToCollectionIfMissing(seancesCollection, ...seancesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const seances: ISeances = sampleWithRequiredData;
        const seances2: ISeances = sampleWithPartialData;
        expectedResult = service.addSeancesToCollectionIfMissing([], seances, seances2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seances);
        expect(expectedResult).toContain(seances2);
      });

      it('should accept null and undefined values', () => {
        const seances: ISeances = sampleWithRequiredData;
        expectedResult = service.addSeancesToCollectionIfMissing([], null, seances, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seances);
      });

      it('should return initial array if no Seances is added', () => {
        const seancesCollection: ISeances[] = [sampleWithRequiredData];
        expectedResult = service.addSeancesToCollectionIfMissing(seancesCollection, undefined, null);
        expect(expectedResult).toEqual(seancesCollection);
      });
    });

    describe('compareSeances', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSeances(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSeances(entity1, entity2);
        const compareResult2 = service.compareSeances(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSeances(entity1, entity2);
        const compareResult2 = service.compareSeances(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSeances(entity1, entity2);
        const compareResult2 = service.compareSeances(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
