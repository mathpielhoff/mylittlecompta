import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ContactsFormService, ContactsFormGroup } from './contacts-form.service';
import { IContacts } from '../contacts.model';
import { ContactsService } from '../service/contacts.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { RelationType } from 'app/entities/enumerations/relation-type.model';

@Component({
  selector: 'jhi-contacts-update',
  templateUrl: './contacts-update.component.html',
})
export class ContactsUpdateComponent implements OnInit {
  isSaving = false;
  contacts: IContacts | null = null;
  relationTypeValues = Object.keys(RelationType);

  patientsSharedCollection: IPatients[] = [];

  editForm: ContactsFormGroup = this.contactsFormService.createContactsFormGroup();

  constructor(
    protected contactsService: ContactsService,
    protected contactsFormService: ContactsFormService,
    protected patientsService: PatientsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePatients = (o1: IPatients | null, o2: IPatients | null): boolean => this.patientsService.comparePatients(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contacts }) => {
      this.contacts = contacts;
      if (contacts) {
        this.updateForm(contacts);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contacts = this.contactsFormService.getContacts(this.editForm);
    if (contacts.id !== null) {
      this.subscribeToSaveResponse(this.contactsService.update(contacts));
    } else {
      this.subscribeToSaveResponse(this.contactsService.create(contacts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContacts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contacts: IContacts): void {
    this.contacts = contacts;
    this.contactsFormService.resetForm(this.editForm, contacts);

    this.patientsSharedCollection = this.patientsService.addPatientsToCollectionIfMissing<IPatients>(
      this.patientsSharedCollection,
      contacts.patients
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientsService
      .query()
      .pipe(map((res: HttpResponse<IPatients[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatients[]) => this.patientsService.addPatientsToCollectionIfMissing<IPatients>(patients, this.contacts?.patients))
      )
      .subscribe((patients: IPatients[]) => (this.patientsSharedCollection = patients));
  }
}
