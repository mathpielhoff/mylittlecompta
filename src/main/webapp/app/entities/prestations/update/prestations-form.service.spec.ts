import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prestations.test-samples';

import { PrestationsFormService } from './prestations-form.service';

describe('Prestations Form Service', () => {
  let service: PrestationsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestationsFormService);
  });

  describe('Service methods', () => {
    describe('createPrestationsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPrestationsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            minutesDuration: expect.any(Object),
            price: expect.any(Object),
          })
        );
      });

      it('passing IPrestations should create a new form with FormGroup', () => {
        const formGroup = service.createPrestationsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            minutesDuration: expect.any(Object),
            price: expect.any(Object),
          })
        );
      });
    });

    describe('getPrestations', () => {
      it('should return NewPrestations for default Prestations initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPrestationsFormGroup(sampleWithNewData);

        const prestations = service.getPrestations(formGroup) as any;

        expect(prestations).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrestations for empty Prestations initial value', () => {
        const formGroup = service.createPrestationsFormGroup();

        const prestations = service.getPrestations(formGroup) as any;

        expect(prestations).toMatchObject({});
      });

      it('should return IPrestations', () => {
        const formGroup = service.createPrestationsFormGroup(sampleWithRequiredData);

        const prestations = service.getPrestations(formGroup) as any;

        expect(prestations).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrestations should not enable id FormControl', () => {
        const formGroup = service.createPrestationsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrestations should disable id FormControl', () => {
        const formGroup = service.createPrestationsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
