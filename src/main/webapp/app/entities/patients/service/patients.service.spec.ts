import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPatients } from '../patients.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../patients.test-samples';

import { PatientsService } from './patients.service';

const requireRestSample: IPatients = {
  ...sampleWithRequiredData,
};

describe('Patients Service', () => {
  let service: PatientsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPatients | IPatients[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PatientsService);
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

    it('should create a Patients', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const patients = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(patients).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Patients', () => {
      const patients = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(patients).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Patients', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Patients', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Patients', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPatientsToCollectionIfMissing', () => {
      it('should add a Patients to an empty array', () => {
        const patients: IPatients = sampleWithRequiredData;
        expectedResult = service.addPatientsToCollectionIfMissing([], patients);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patients);
      });

      it('should not add a Patients to an array that contains it', () => {
        const patients: IPatients = sampleWithRequiredData;
        const patientsCollection: IPatients[] = [
          {
            ...patients,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, patients);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Patients to an array that doesn't contain it", () => {
        const patients: IPatients = sampleWithRequiredData;
        const patientsCollection: IPatients[] = [sampleWithPartialData];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, patients);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patients);
      });

      it('should add only unique Patients to an array', () => {
        const patientsArray: IPatients[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const patientsCollection: IPatients[] = [sampleWithRequiredData];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, ...patientsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const patients: IPatients = sampleWithRequiredData;
        const patients2: IPatients = sampleWithPartialData;
        expectedResult = service.addPatientsToCollectionIfMissing([], patients, patients2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patients);
        expect(expectedResult).toContain(patients2);
      });

      it('should accept null and undefined values', () => {
        const patients: IPatients = sampleWithRequiredData;
        expectedResult = service.addPatientsToCollectionIfMissing([], null, patients, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patients);
      });

      it('should return initial array if no Patients is added', () => {
        const patientsCollection: IPatients[] = [sampleWithRequiredData];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, undefined, null);
        expect(expectedResult).toEqual(patientsCollection);
      });
    });

    describe('comparePatients', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePatients(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.comparePatients(entity1, entity2);
        const compareResult2 = service.comparePatients(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.comparePatients(entity1, entity2);
        const compareResult2 = service.comparePatients(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.comparePatients(entity1, entity2);
        const compareResult2 = service.comparePatients(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
