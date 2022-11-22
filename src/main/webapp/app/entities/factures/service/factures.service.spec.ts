import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFactures } from '../factures.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../factures.test-samples';

import { FacturesService, RestFactures } from './factures.service';

const requireRestSample: RestFactures = {
  ...sampleWithRequiredData,
  emissionDate: sampleWithRequiredData.emissionDate?.toJSON(),
};

describe('Factures Service', () => {
  let service: FacturesService;
  let httpMock: HttpTestingController;
  let expectedResult: IFactures | IFactures[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FacturesService);
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

    it('should create a Factures', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const factures = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(factures).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Factures', () => {
      const factures = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(factures).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Factures', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Factures', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Factures', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFacturesToCollectionIfMissing', () => {
      it('should add a Factures to an empty array', () => {
        const factures: IFactures = sampleWithRequiredData;
        expectedResult = service.addFacturesToCollectionIfMissing([], factures);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(factures);
      });

      it('should not add a Factures to an array that contains it', () => {
        const factures: IFactures = sampleWithRequiredData;
        const facturesCollection: IFactures[] = [
          {
            ...factures,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, factures);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Factures to an array that doesn't contain it", () => {
        const factures: IFactures = sampleWithRequiredData;
        const facturesCollection: IFactures[] = [sampleWithPartialData];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, factures);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(factures);
      });

      it('should add only unique Factures to an array', () => {
        const facturesArray: IFactures[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const facturesCollection: IFactures[] = [sampleWithRequiredData];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, ...facturesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const factures: IFactures = sampleWithRequiredData;
        const factures2: IFactures = sampleWithPartialData;
        expectedResult = service.addFacturesToCollectionIfMissing([], factures, factures2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(factures);
        expect(expectedResult).toContain(factures2);
      });

      it('should accept null and undefined values', () => {
        const factures: IFactures = sampleWithRequiredData;
        expectedResult = service.addFacturesToCollectionIfMissing([], null, factures, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(factures);
      });

      it('should return initial array if no Factures is added', () => {
        const facturesCollection: IFactures[] = [sampleWithRequiredData];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, undefined, null);
        expect(expectedResult).toEqual(facturesCollection);
      });
    });

    describe('compareFactures', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFactures(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareFactures(entity1, entity2);
        const compareResult2 = service.compareFactures(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareFactures(entity1, entity2);
        const compareResult2 = service.compareFactures(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareFactures(entity1, entity2);
        const compareResult2 = service.compareFactures(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
