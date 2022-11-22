import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SeancesFormService } from './seances-form.service';
import { SeancesService } from '../service/seances.service';
import { ISeances } from '../seances.model';
import { IPrestations } from 'app/entities/prestations/prestations.model';
import { PrestationsService } from 'app/entities/prestations/service/prestations.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IFactures } from 'app/entities/factures/factures.model';
import { FacturesService } from 'app/entities/factures/service/factures.service';

import { SeancesUpdateComponent } from './seances-update.component';

describe('Seances Management Update Component', () => {
  let comp: SeancesUpdateComponent;
  let fixture: ComponentFixture<SeancesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seancesFormService: SeancesFormService;
  let seancesService: SeancesService;
  let prestationsService: PrestationsService;
  let patientsService: PatientsService;
  let facturesService: FacturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SeancesUpdateComponent],
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
      .overrideTemplate(SeancesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeancesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    seancesFormService = TestBed.inject(SeancesFormService);
    seancesService = TestBed.inject(SeancesService);
    prestationsService = TestBed.inject(PrestationsService);
    patientsService = TestBed.inject(PatientsService);
    facturesService = TestBed.inject(FacturesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call prestations query and add missing value', () => {
      const seances: ISeances = { id: 'CBA' };
      const prestations: IPrestations = { id: 'ca64e8f3-147a-4fd7-bf6b-28a6d4b27619' };
      seances.prestations = prestations;

      const prestationsCollection: IPrestations[] = [{ id: '90166ae2-55f6-4b65-9496-9a7f3ac906c4' }];
      jest.spyOn(prestationsService, 'query').mockReturnValue(of(new HttpResponse({ body: prestationsCollection })));
      const expectedCollection: IPrestations[] = [prestations, ...prestationsCollection];
      jest.spyOn(prestationsService, 'addPrestationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      expect(prestationsService.query).toHaveBeenCalled();
      expect(prestationsService.addPrestationsToCollectionIfMissing).toHaveBeenCalledWith(prestationsCollection, prestations);
      expect(comp.prestationsCollection).toEqual(expectedCollection);
    });

    it('Should call Patients query and add missing value', () => {
      const seances: ISeances = { id: 'CBA' };
      const patients: IPatients = { id: '7428d049-1a20-4ce1-89d3-372c6a4e829c' };
      seances.patients = patients;

      const patientsCollection: IPatients[] = [{ id: 'e82bb920-97ce-4aef-99a9-7f3b352936ea' }];
      jest.spyOn(patientsService, 'query').mockReturnValue(of(new HttpResponse({ body: patientsCollection })));
      const additionalPatients = [patients];
      const expectedCollection: IPatients[] = [...additionalPatients, ...patientsCollection];
      jest.spyOn(patientsService, 'addPatientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      expect(patientsService.query).toHaveBeenCalled();
      expect(patientsService.addPatientsToCollectionIfMissing).toHaveBeenCalledWith(
        patientsCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Factures query and add missing value', () => {
      const seances: ISeances = { id: 'CBA' };
      const factures: IFactures = { id: 'c2d957c1-7710-4af6-80eb-8c41d0874625' };
      seances.factures = factures;

      const facturesCollection: IFactures[] = [{ id: '70d635f8-efaa-45cf-ab8a-e9abb59b1f38' }];
      jest.spyOn(facturesService, 'query').mockReturnValue(of(new HttpResponse({ body: facturesCollection })));
      const additionalFactures = [factures];
      const expectedCollection: IFactures[] = [...additionalFactures, ...facturesCollection];
      jest.spyOn(facturesService, 'addFacturesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      expect(facturesService.query).toHaveBeenCalled();
      expect(facturesService.addFacturesToCollectionIfMissing).toHaveBeenCalledWith(
        facturesCollection,
        ...additionalFactures.map(expect.objectContaining)
      );
      expect(comp.facturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const seances: ISeances = { id: 'CBA' };
      const prestations: IPrestations = { id: '1890c9bb-2b5b-4e91-b742-5607d476181c' };
      seances.prestations = prestations;
      const patients: IPatients = { id: 'b05f01ea-1f89-4bc9-a22d-7a7a96ceccc4' };
      seances.patients = patients;
      const factures: IFactures = { id: 'aea398c3-5afc-44f8-87d1-0ff2b948ff77' };
      seances.factures = factures;

      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      expect(comp.prestationsCollection).toContain(prestations);
      expect(comp.patientsSharedCollection).toContain(patients);
      expect(comp.facturesSharedCollection).toContain(factures);
      expect(comp.seances).toEqual(seances);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeances>>();
      const seances = { id: 'ABC' };
      jest.spyOn(seancesFormService, 'getSeances').mockReturnValue(seances);
      jest.spyOn(seancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seances }));
      saveSubject.complete();

      // THEN
      expect(seancesFormService.getSeances).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(seancesService.update).toHaveBeenCalledWith(expect.objectContaining(seances));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeances>>();
      const seances = { id: 'ABC' };
      jest.spyOn(seancesFormService, 'getSeances').mockReturnValue({ id: null });
      jest.spyOn(seancesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seances: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seances }));
      saveSubject.complete();

      // THEN
      expect(seancesFormService.getSeances).toHaveBeenCalled();
      expect(seancesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeances>>();
      const seances = { id: 'ABC' };
      jest.spyOn(seancesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seances });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(seancesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePrestations', () => {
      it('Should forward to prestationsService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(prestationsService, 'comparePrestations');
        comp.comparePrestations(entity, entity2);
        expect(prestationsService.comparePrestations).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePatients', () => {
      it('Should forward to patientsService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(patientsService, 'comparePatients');
        comp.comparePatients(entity, entity2);
        expect(patientsService.comparePatients).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFactures', () => {
      it('Should forward to facturesService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(facturesService, 'compareFactures');
        comp.compareFactures(entity, entity2);
        expect(facturesService.compareFactures).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
