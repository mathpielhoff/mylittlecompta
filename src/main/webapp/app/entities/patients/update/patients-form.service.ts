import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPatients, NewPatients } from '../patients.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPatients for edit and NewPatientsFormGroupInput for create.
 */
type PatientsFormGroupInput = IPatients | PartialWithRequiredKeyOf<NewPatients>;

type PatientsFormDefaults = Pick<NewPatients, 'id'>;

type PatientsFormGroupContent = {
  id: FormControl<IPatients['id'] | NewPatients['id']>;
  firstName: FormControl<IPatients['firstName']>;
  lastName: FormControl<IPatients['lastName']>;
  age: FormControl<IPatients['age']>;
  schoolClass: FormControl<IPatients['schoolClass']>;
  school: FormControl<IPatients['school']>;
};

export type PatientsFormGroup = FormGroup<PatientsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PatientsFormService {
  createPatientsFormGroup(patients: PatientsFormGroupInput = { id: null }): PatientsFormGroup {
    const patientsRawValue = {
      ...this.getFormDefaults(),
      ...patients,
    };
    return new FormGroup<PatientsFormGroupContent>({
      id: new FormControl(
        { value: patientsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(patientsRawValue.firstName),
      lastName: new FormControl(patientsRawValue.lastName),
      age: new FormControl(patientsRawValue.age),
      schoolClass: new FormControl(patientsRawValue.schoolClass),
      school: new FormControl(patientsRawValue.school),
    });
  }

  getPatients(form: PatientsFormGroup): IPatients | NewPatients {
    return form.getRawValue() as IPatients | NewPatients;
  }

  resetForm(form: PatientsFormGroup, patients: PatientsFormGroupInput): void {
    const patientsRawValue = { ...this.getFormDefaults(), ...patients };
    form.reset(
      {
        ...patientsRawValue,
        id: { value: patientsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PatientsFormDefaults {
    return {
      id: null,
    };
  }
}
