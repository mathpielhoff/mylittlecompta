import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../patients.test-samples';

import { PatientsFormService } from './patients-form.service';

describe('Patients Form Service', () => {
  let service: PatientsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsFormService);
  });

  describe('Service methods', () => {
    describe('createPatientsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPatientsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            age: expect.any(Object),
            schoolClass: expect.any(Object),
            school: expect.any(Object),
          })
        );
      });

      it('passing IPatients should create a new form with FormGroup', () => {
        const formGroup = service.createPatientsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            age: expect.any(Object),
            schoolClass: expect.any(Object),
            school: expect.any(Object),
          })
        );
      });
    });

    describe('getPatients', () => {
      it('should return NewPatients for default Patients initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPatientsFormGroup(sampleWithNewData);

        const patients = service.getPatients(formGroup) as any;

        expect(patients).toMatchObject(sampleWithNewData);
      });

      it('should return NewPatients for empty Patients initial value', () => {
        const formGroup = service.createPatientsFormGroup();

        const patients = service.getPatients(formGroup) as any;

        expect(patients).toMatchObject({});
      });

      it('should return IPatients', () => {
        const formGroup = service.createPatientsFormGroup(sampleWithRequiredData);

        const patients = service.getPatients(formGroup) as any;

        expect(patients).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPatients should not enable id FormControl', () => {
        const formGroup = service.createPatientsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPatients should disable id FormControl', () => {
        const formGroup = service.createPatientsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
