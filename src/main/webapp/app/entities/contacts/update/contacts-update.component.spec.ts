import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContactsFormService } from './contacts-form.service';
import { ContactsService } from '../service/contacts.service';
import { IContacts } from '../contacts.model';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';

import { ContactsUpdateComponent } from './contacts-update.component';

describe('Contacts Management Update Component', () => {
  let comp: ContactsUpdateComponent;
  let fixture: ComponentFixture<ContactsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contactsFormService: ContactsFormService;
  let contactsService: ContactsService;
  let patientsService: PatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContactsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ContactsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContactsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactsFormService = TestBed.inject(ContactsFormService);
    contactsService = TestBed.inject(ContactsService);
    patientsService = TestBed.inject(PatientsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Patients query and add missing value', () => {
      const contacts: IContacts = { id: 'CBA' };
      const patients: IPatients = { id: '4e573054-0c02-47dd-a206-ccc8c32c456a' };
      contacts.patients = patients;

      const patientsCollection: IPatients[] = [{ id: '17224139-7385-4694-967e-cddd3cb30b02' }];
      jest.spyOn(patientsService, 'query').mockReturnValue(of(new HttpResponse({ body: patientsCollection })));
      const additionalPatients = [patients];
      const expectedCollection: IPatients[] = [...additionalPatients, ...patientsCollection];
      jest.spyOn(patientsService, 'addPatientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      expect(patientsService.query).toHaveBeenCalled();
      expect(patientsService.addPatientsToCollectionIfMissing).toHaveBeenCalledWith(
        patientsCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contacts: IContacts = { id: 'CBA' };
      const patients: IPatients = { id: '07d79860-d282-4f9f-9d52-41ec42a8d775' };
      contacts.patients = patients;

      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      expect(comp.patientsSharedCollection).toContain(patients);
      expect(comp.contacts).toEqual(contacts);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 'ABC' };
      jest.spyOn(contactsFormService, 'getContacts').mockReturnValue(contacts);
      jest.spyOn(contactsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacts }));
      saveSubject.complete();

      // THEN
      expect(contactsFormService.getContacts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(contactsService.update).toHaveBeenCalledWith(expect.objectContaining(contacts));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 'ABC' };
      jest.spyOn(contactsFormService, 'getContacts').mockReturnValue({ id: null });
      jest.spyOn(contactsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacts }));
      saveSubject.complete();

      // THEN
      expect(contactsFormService.getContacts).toHaveBeenCalled();
      expect(contactsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 'ABC' };
      jest.spyOn(contactsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contactsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePatients', () => {
      it('Should forward to patientsService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(patientsService, 'comparePatients');
        comp.comparePatients(entity, entity2);
        expect(patientsService.comparePatients).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
