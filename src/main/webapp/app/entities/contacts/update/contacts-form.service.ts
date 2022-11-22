import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IContacts, NewContacts } from '../contacts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContacts for edit and NewContactsFormGroupInput for create.
 */
type ContactsFormGroupInput = IContacts | PartialWithRequiredKeyOf<NewContacts>;

type ContactsFormDefaults = Pick<NewContacts, 'id'>;

type ContactsFormGroupContent = {
  id: FormControl<IContacts['id'] | NewContacts['id']>;
  firstName: FormControl<IContacts['firstName']>;
  lastName: FormControl<IContacts['lastName']>;
  phoneNumber: FormControl<IContacts['phoneNumber']>;
  address: FormControl<IContacts['address']>;
  relationType: FormControl<IContacts['relationType']>;
  patients: FormControl<IContacts['patients']>;
};

export type ContactsFormGroup = FormGroup<ContactsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContactsFormService {
  createContactsFormGroup(contacts: ContactsFormGroupInput = { id: null }): ContactsFormGroup {
    const contactsRawValue = {
      ...this.getFormDefaults(),
      ...contacts,
    };
    return new FormGroup<ContactsFormGroupContent>({
      id: new FormControl(
        { value: contactsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(contactsRawValue.firstName),
      lastName: new FormControl(contactsRawValue.lastName),
      phoneNumber: new FormControl(contactsRawValue.phoneNumber),
      address: new FormControl(contactsRawValue.address),
      relationType: new FormControl(contactsRawValue.relationType),
      patients: new FormControl(contactsRawValue.patients),
    });
  }

  getContacts(form: ContactsFormGroup): IContacts | NewContacts {
    return form.getRawValue() as IContacts | NewContacts;
  }

  resetForm(form: ContactsFormGroup, contacts: ContactsFormGroupInput): void {
    const contactsRawValue = { ...this.getFormDefaults(), ...contacts };
    form.reset(
      {
        ...contactsRawValue,
        id: { value: contactsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContactsFormDefaults {
    return {
      id: null,
    };
  }
}
