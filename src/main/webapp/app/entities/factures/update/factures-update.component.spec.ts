import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FacturesFormService } from './factures-form.service';
import { FacturesService } from '../service/factures.service';
import { IFactures } from '../factures.model';
import { IContacts } from 'app/entities/contacts/contacts.model';
import { ContactsService } from 'app/entities/contacts/service/contacts.service';

import { FacturesUpdateComponent } from './factures-update.component';

describe('Factures Management Update Component', () => {
  let comp: FacturesUpdateComponent;
  let fixture: ComponentFixture<FacturesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facturesFormService: FacturesFormService;
  let facturesService: FacturesService;
  let contactsService: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FacturesUpdateComponent],
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
      .overrideTemplate(FacturesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facturesFormService = TestBed.inject(FacturesFormService);
    facturesService = TestBed.inject(FacturesService);
    contactsService = TestBed.inject(ContactsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call contacts query and add missing value', () => {
      const factures: IFactures = { id: 'CBA' };
      const contacts: IContacts = { id: '731ba80d-84bd-412f-9f3a-8db08071e0e5' };
      factures.contacts = contacts;

      const contactsCollection: IContacts[] = [{ id: '1135c074-8ceb-4c5c-a358-0c68fddaed0a' }];
      jest.spyOn(contactsService, 'query').mockReturnValue(of(new HttpResponse({ body: contactsCollection })));
      const expectedCollection: IContacts[] = [contacts, ...contactsCollection];
      jest.spyOn(contactsService, 'addContactsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      expect(contactsService.query).toHaveBeenCalled();
      expect(contactsService.addContactsToCollectionIfMissing).toHaveBeenCalledWith(contactsCollection, contacts);
      expect(comp.contactsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const factures: IFactures = { id: 'CBA' };
      const contacts: IContacts = { id: 'ee813f09-d6b2-4ffb-888c-f38f638b9d33' };
      factures.contacts = contacts;

      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      expect(comp.contactsCollection).toContain(contacts);
      expect(comp.factures).toEqual(factures);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactures>>();
      const factures = { id: 'ABC' };
      jest.spyOn(facturesFormService, 'getFactures').mockReturnValue(factures);
      jest.spyOn(facturesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factures }));
      saveSubject.complete();

      // THEN
      expect(facturesFormService.getFactures).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(facturesService.update).toHaveBeenCalledWith(expect.objectContaining(factures));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactures>>();
      const factures = { id: 'ABC' };
      jest.spyOn(facturesFormService, 'getFactures').mockReturnValue({ id: null });
      jest.spyOn(facturesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factures }));
      saveSubject.complete();

      // THEN
      expect(facturesFormService.getFactures).toHaveBeenCalled();
      expect(facturesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactures>>();
      const factures = { id: 'ABC' };
      jest.spyOn(facturesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facturesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareContacts', () => {
      it('Should forward to contactsService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(contactsService, 'compareContacts');
        comp.compareContacts(entity, entity2);
        expect(contactsService.compareContacts).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
