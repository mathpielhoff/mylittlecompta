import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../seances.test-samples';

import { SeancesFormService } from './seances-form.service';

describe('Seances Form Service', () => {
  let service: SeancesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeancesFormService);
  });

  describe('Service methods', () => {
    describe('createSeancesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSeancesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            place: expect.any(Object),
            date: expect.any(Object),
            prestations: expect.any(Object),
            patients: expect.any(Object),
            factures: expect.any(Object),
          })
        );
      });

      it('passing ISeances should create a new form with FormGroup', () => {
        const formGroup = service.createSeancesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            place: expect.any(Object),
            date: expect.any(Object),
            prestations: expect.any(Object),
            patients: expect.any(Object),
            factures: expect.any(Object),
          })
        );
      });
    });

    describe('getSeances', () => {
      it('should return NewSeances for default Seances initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSeancesFormGroup(sampleWithNewData);

        const seances = service.getSeances(formGroup) as any;

        expect(seances).toMatchObject(sampleWithNewData);
      });

      it('should return NewSeances for empty Seances initial value', () => {
        const formGroup = service.createSeancesFormGroup();

        const seances = service.getSeances(formGroup) as any;

        expect(seances).toMatchObject({});
      });

      it('should return ISeances', () => {
        const formGroup = service.createSeancesFormGroup(sampleWithRequiredData);

        const seances = service.getSeances(formGroup) as any;

        expect(seances).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISeances should not enable id FormControl', () => {
        const formGroup = service.createSeancesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSeances should disable id FormControl', () => {
        const formGroup = service.createSeancesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
