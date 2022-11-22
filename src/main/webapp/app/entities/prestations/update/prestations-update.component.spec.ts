import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PrestationsFormService } from './prestations-form.service';
import { PrestationsService } from '../service/prestations.service';
import { IPrestations } from '../prestations.model';

import { PrestationsUpdateComponent } from './prestations-update.component';

describe('Prestations Management Update Component', () => {
  let comp: PrestationsUpdateComponent;
  let fixture: ComponentFixture<PrestationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let prestationsFormService: PrestationsFormService;
  let prestationsService: PrestationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PrestationsUpdateComponent],
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
      .overrideTemplate(PrestationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrestationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prestationsFormService = TestBed.inject(PrestationsFormService);
    prestationsService = TestBed.inject(PrestationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const prestations: IPrestations = { id: 'CBA' };

      activatedRoute.data = of({ prestations });
      comp.ngOnInit();

      expect(comp.prestations).toEqual(prestations);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrestations>>();
      const prestations = { id: 'ABC' };
      jest.spyOn(prestationsFormService, 'getPrestations').mockReturnValue(prestations);
      jest.spyOn(prestationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prestations }));
      saveSubject.complete();

      // THEN
      expect(prestationsFormService.getPrestations).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prestationsService.update).toHaveBeenCalledWith(expect.objectContaining(prestations));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrestations>>();
      const prestations = { id: 'ABC' };
      jest.spyOn(prestationsFormService, 'getPrestations').mockReturnValue({ id: null });
      jest.spyOn(prestationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestations: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prestations }));
      saveSubject.complete();

      // THEN
      expect(prestationsFormService.getPrestations).toHaveBeenCalled();
      expect(prestationsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrestations>>();
      const prestations = { id: 'ABC' };
      jest.spyOn(prestationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prestationsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
