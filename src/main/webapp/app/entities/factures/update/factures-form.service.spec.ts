import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../factures.test-samples';

import { FacturesFormService } from './factures-form.service';

describe('Factures Form Service', () => {
  let service: FacturesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturesFormService);
  });

  describe('Service methods', () => {
    describe('createFacturesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFacturesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            number: expect.any(Object),
            emissionDate: expect.any(Object),
            paidInvoice: expect.any(Object),
            contacts: expect.any(Object),
          })
        );
      });

      it('passing IFactures should create a new form with FormGroup', () => {
        const formGroup = service.createFacturesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            number: expect.any(Object),
            emissionDate: expect.any(Object),
            paidInvoice: expect.any(Object),
            contacts: expect.any(Object),
          })
        );
      });
    });

    describe('getFactures', () => {
      it('should return NewFactures for default Factures initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFacturesFormGroup(sampleWithNewData);

        const factures = service.getFactures(formGroup) as any;

        expect(factures).toMatchObject(sampleWithNewData);
      });

      it('should return NewFactures for empty Factures initial value', () => {
        const formGroup = service.createFacturesFormGroup();

        const factures = service.getFactures(formGroup) as any;

        expect(factures).toMatchObject({});
      });

      it('should return IFactures', () => {
        const formGroup = service.createFacturesFormGroup(sampleWithRequiredData);

        const factures = service.getFactures(formGroup) as any;

        expect(factures).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFactures should not enable id FormControl', () => {
        const formGroup = service.createFacturesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFactures should disable id FormControl', () => {
        const formGroup = service.createFacturesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
