import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPrestations, NewPrestations } from '../prestations.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrestations for edit and NewPrestationsFormGroupInput for create.
 */
type PrestationsFormGroupInput = IPrestations | PartialWithRequiredKeyOf<NewPrestations>;

type PrestationsFormDefaults = Pick<NewPrestations, 'id'>;

type PrestationsFormGroupContent = {
  id: FormControl<IPrestations['id'] | NewPrestations['id']>;
  label: FormControl<IPrestations['label']>;
  minutesDuration: FormControl<IPrestations['minutesDuration']>;
  price: FormControl<IPrestations['price']>;
};

export type PrestationsFormGroup = FormGroup<PrestationsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PrestationsFormService {
  createPrestationsFormGroup(prestations: PrestationsFormGroupInput = { id: null }): PrestationsFormGroup {
    const prestationsRawValue = {
      ...this.getFormDefaults(),
      ...prestations,
    };
    return new FormGroup<PrestationsFormGroupContent>({
      id: new FormControl(
        { value: prestationsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      label: new FormControl(prestationsRawValue.label),
      minutesDuration: new FormControl(prestationsRawValue.minutesDuration),
      price: new FormControl(prestationsRawValue.price),
    });
  }

  getPrestations(form: PrestationsFormGroup): IPrestations | NewPrestations {
    return form.getRawValue() as IPrestations | NewPrestations;
  }

  resetForm(form: PrestationsFormGroup, prestations: PrestationsFormGroupInput): void {
    const prestationsRawValue = { ...this.getFormDefaults(), ...prestations };
    form.reset(
      {
        ...prestationsRawValue,
        id: { value: prestationsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PrestationsFormDefaults {
    return {
      id: null,
    };
  }
}
