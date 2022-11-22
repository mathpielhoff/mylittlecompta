import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IContacts } from '../contacts.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../contacts.test-samples';

import { ContactsService } from './contacts.service';

const requireRestSample: IContacts = {
  ...sampleWithRequiredData,
};

describe('Contacts Service', () => {
  let service: ContactsService;
  let httpMock: HttpTestingController;
  let expectedResult: IContacts | IContacts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ContactsService);
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

    it('should create a Contacts', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const contacts = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(contacts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Contacts', () => {
      const contacts = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(contacts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Contacts', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Contacts', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Contacts', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addContactsToCollectionIfMissing', () => {
      it('should add a Contacts to an empty array', () => {
        const contacts: IContacts = sampleWithRequiredData;
        expectedResult = service.addContactsToCollectionIfMissing([], contacts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contacts);
      });

      it('should not add a Contacts to an array that contains it', () => {
        const contacts: IContacts = sampleWithRequiredData;
        const contactsCollection: IContacts[] = [
          {
            ...contacts,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addContactsToCollectionIfMissing(contactsCollection, contacts);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Contacts to an array that doesn't contain it", () => {
        const contacts: IContacts = sampleWithRequiredData;
        const contactsCollection: IContacts[] = [sampleWithPartialData];
        expectedResult = service.addContactsToCollectionIfMissing(contactsCollection, contacts);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contacts);
      });

      it('should add only unique Contacts to an array', () => {
        const contactsArray: IContacts[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const contactsCollection: IContacts[] = [sampleWithRequiredData];
        expectedResult = service.addContactsToCollectionIfMissing(contactsCollection, ...contactsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contacts: IContacts = sampleWithRequiredData;
        const contacts2: IContacts = sampleWithPartialData;
        expectedResult = service.addContactsToCollectionIfMissing([], contacts, contacts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contacts);
        expect(expectedResult).toContain(contacts2);
      });

      it('should accept null and undefined values', () => {
        const contacts: IContacts = sampleWithRequiredData;
        expectedResult = service.addContactsToCollectionIfMissing([], null, contacts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contacts);
      });

      it('should return initial array if no Contacts is added', () => {
        const contactsCollection: IContacts[] = [sampleWithRequiredData];
        expectedResult = service.addContactsToCollectionIfMissing(contactsCollection, undefined, null);
        expect(expectedResult).toEqual(contactsCollection);
      });
    });

    describe('compareContacts', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareContacts(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareContacts(entity1, entity2);
        const compareResult2 = service.compareContacts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareContacts(entity1, entity2);
        const compareResult2 = service.compareContacts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareContacts(entity1, entity2);
        const compareResult2 = service.compareContacts(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
