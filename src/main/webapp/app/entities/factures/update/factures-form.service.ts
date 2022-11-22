import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFactures, NewFactures } from '../factures.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFactures for edit and NewFacturesFormGroupInput for create.
 */
type FacturesFormGroupInput = IFactures | PartialWithRequiredKeyOf<NewFactures>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFactures | NewFactures> = Omit<T, 'emissionDate'> & {
  emissionDate?: string | null;
};

type FacturesFormRawValue = FormValueOf<IFactures>;

type NewFacturesFormRawValue = FormValueOf<NewFactures>;

type FacturesFormDefaults = Pick<NewFactures, 'id' | 'emissionDate' | 'paidInvoice'>;

type FacturesFormGroupContent = {
  id: FormControl<FacturesFormRawValue['id'] | NewFactures['id']>;
  number: FormControl<FacturesFormRawValue['number']>;
  emissionDate: FormControl<FacturesFormRawValue['emissionDate']>;
  paidInvoice: FormControl<FacturesFormRawValue['paidInvoice']>;
  contacts: FormControl<FacturesFormRawValue['contacts']>;
};

export type FacturesFormGroup = FormGroup<FacturesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FacturesFormService {
  createFacturesFormGroup(factures: FacturesFormGroupInput = { id: null }): FacturesFormGroup {
    const facturesRawValue = this.convertFacturesToFacturesRawValue({
      ...this.getFormDefaults(),
      ...factures,
    });
    return new FormGroup<FacturesFormGroupContent>({
      id: new FormControl(
        { value: facturesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      number: new FormControl(facturesRawValue.number),
      emissionDate: new FormControl(facturesRawValue.emissionDate),
      paidInvoice: new FormControl(facturesRawValue.paidInvoice),
      contacts: new FormControl(facturesRawValue.contacts),
    });
  }

  getFactures(form: FacturesFormGroup): IFactures | NewFactures {
    return this.convertFacturesRawValueToFactures(form.getRawValue() as FacturesFormRawValue | NewFacturesFormRawValue);
  }

  resetForm(form: FacturesFormGroup, factures: FacturesFormGroupInput): void {
    const facturesRawValue = this.convertFacturesToFacturesRawValue({ ...this.getFormDefaults(), ...factures });
    form.reset(
      {
        ...facturesRawValue,
        id: { value: facturesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FacturesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      emissionDate: currentTime,
      paidInvoice: false,
    };
  }

  private convertFacturesRawValueToFactures(rawFactures: FacturesFormRawValue | NewFacturesFormRawValue): IFactures | NewFactures {
    return {
      ...rawFactures,
      emissionDate: dayjs(rawFactures.emissionDate, DATE_TIME_FORMAT),
    };
  }

  private convertFacturesToFacturesRawValue(
    factures: IFactures | (Partial<NewFactures> & FacturesFormDefaults)
  ): FacturesFormRawValue | PartialWithRequiredKeyOf<NewFacturesFormRawValue> {
    return {
      ...factures,
      emissionDate: factures.emissionDate ? factures.emissionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
