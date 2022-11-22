import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISeances, NewSeances } from '../seances.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISeances for edit and NewSeancesFormGroupInput for create.
 */
type SeancesFormGroupInput = ISeances | PartialWithRequiredKeyOf<NewSeances>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISeances | NewSeances> = Omit<T, 'date'> & {
  date?: string | null;
};

type SeancesFormRawValue = FormValueOf<ISeances>;

type NewSeancesFormRawValue = FormValueOf<NewSeances>;

type SeancesFormDefaults = Pick<NewSeances, 'id' | 'date'>;

type SeancesFormGroupContent = {
  id: FormControl<SeancesFormRawValue['id'] | NewSeances['id']>;
  place: FormControl<SeancesFormRawValue['place']>;
  date: FormControl<SeancesFormRawValue['date']>;
  prestations: FormControl<SeancesFormRawValue['prestations']>;
  patients: FormControl<SeancesFormRawValue['patients']>;
  factures: FormControl<SeancesFormRawValue['factures']>;
};

export type SeancesFormGroup = FormGroup<SeancesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SeancesFormService {
  createSeancesFormGroup(seances: SeancesFormGroupInput = { id: null }): SeancesFormGroup {
    const seancesRawValue = this.convertSeancesToSeancesRawValue({
      ...this.getFormDefaults(),
      ...seances,
    });
    return new FormGroup<SeancesFormGroupContent>({
      id: new FormControl(
        { value: seancesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      place: new FormControl(seancesRawValue.place),
      date: new FormControl(seancesRawValue.date),
      prestations: new FormControl(seancesRawValue.prestations),
      patients: new FormControl(seancesRawValue.patients),
      factures: new FormControl(seancesRawValue.factures),
    });
  }

  getSeances(form: SeancesFormGroup): ISeances | NewSeances {
    return this.convertSeancesRawValueToSeances(form.getRawValue() as SeancesFormRawValue | NewSeancesFormRawValue);
  }

  resetForm(form: SeancesFormGroup, seances: SeancesFormGroupInput): void {
    const seancesRawValue = this.convertSeancesToSeancesRawValue({ ...this.getFormDefaults(), ...seances });
    form.reset(
      {
        ...seancesRawValue,
        id: { value: seancesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SeancesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertSeancesRawValueToSeances(rawSeances: SeancesFormRawValue | NewSeancesFormRawValue): ISeances | NewSeances {
    return {
      ...rawSeances,
      date: dayjs(rawSeances.date, DATE_TIME_FORMAT),
    };
  }

  private convertSeancesToSeancesRawValue(
    seances: ISeances | (Partial<NewSeances> & SeancesFormDefaults)
  ): SeancesFormRawValue | PartialWithRequiredKeyOf<NewSeancesFormRawValue> {
    return {
      ...seances,
      date: seances.date ? seances.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
