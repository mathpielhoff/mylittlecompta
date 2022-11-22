import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FacturesFormService, FacturesFormGroup } from './factures-form.service';
import { IFactures } from '../factures.model';
import { FacturesService } from '../service/factures.service';
import { IContacts } from 'app/entities/contacts/contacts.model';
import { ContactsService } from 'app/entities/contacts/service/contacts.service';

@Component({
  selector: 'jhi-factures-update',
  templateUrl: './factures-update.component.html',
})
export class FacturesUpdateComponent implements OnInit {
  isSaving = false;
  factures: IFactures | null = null;

  contactsCollection: IContacts[] = [];

  editForm: FacturesFormGroup = this.facturesFormService.createFacturesFormGroup();

  constructor(
    protected facturesService: FacturesService,
    protected facturesFormService: FacturesFormService,
    protected contactsService: ContactsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareContacts = (o1: IContacts | null, o2: IContacts | null): boolean => this.contactsService.compareContacts(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ factures }) => {
      this.factures = factures;
      if (factures) {
        this.updateForm(factures);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const factures = this.facturesFormService.getFactures(this.editForm);
    if (factures.id !== null) {
      this.subscribeToSaveResponse(this.facturesService.update(factures));
    } else {
      this.subscribeToSaveResponse(this.facturesService.create(factures));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFactures>>): void {
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

  protected updateForm(factures: IFactures): void {
    this.factures = factures;
    this.facturesFormService.resetForm(this.editForm, factures);

    this.contactsCollection = this.contactsService.addContactsToCollectionIfMissing<IContacts>(this.contactsCollection, factures.contacts);
  }

  protected loadRelationshipsOptions(): void {
    this.contactsService
      .query({ filter: 'factures-is-null' })
      .pipe(map((res: HttpResponse<IContacts[]>) => res.body ?? []))
      .pipe(
        map((contacts: IContacts[]) => this.contactsService.addContactsToCollectionIfMissing<IContacts>(contacts, this.factures?.contacts))
      )
      .subscribe((contacts: IContacts[]) => (this.contactsCollection = contacts));
  }
}
