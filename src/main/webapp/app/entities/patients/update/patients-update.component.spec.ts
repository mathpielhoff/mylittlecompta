import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PatientsFormService } from './patients-form.service';
import { PatientsService } from '../service/patients.service';
import { IPatients } from '../patients.model';

import { PatientsUpdateComponent } from './patients-update.component';

describe('Patients Management Update Component', () => {
  let comp: PatientsUpdateComponent;
  let fixture: ComponentFixture<PatientsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let patientsFormService: PatientsFormService;
  let patientsService: PatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PatientsUpdateComponent],
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
      .overrideTemplate(PatientsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatientsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    patientsFormService = TestBed.inject(PatientsFormService);
    patientsService = TestBed.inject(PatientsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const patients: IPatients = { id: 'CBA' };

      activatedRoute.data = of({ patients });
      comp.ngOnInit();

      expect(comp.patients).toEqual(patients);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatients>>();
      const patients = { id: 'ABC' };
      jest.spyOn(patientsFormService, 'getPatients').mockReturnValue(patients);
      jest.spyOn(patientsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patients });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patients }));
      saveSubject.complete();

      // THEN
      expect(patientsFormService.getPatients).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(patientsService.update).toHaveBeenCalledWith(expect.objectContaining(patients));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatients>>();
      const patients = { id: 'ABC' };
      jest.spyOn(patientsFormService, 'getPatients').mockReturnValue({ id: null });
      jest.spyOn(patientsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patients: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: patients }));
      saveSubject.complete();

      // THEN
      expect(patientsFormService.getPatients).toHaveBeenCalled();
      expect(patientsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPatients>>();
      const patients = { id: 'ABC' };
      jest.spyOn(patientsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ patients });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(patientsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
