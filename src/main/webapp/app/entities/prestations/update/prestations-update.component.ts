import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PrestationsFormService, PrestationsFormGroup } from './prestations-form.service';
import { IPrestations } from '../prestations.model';
import { PrestationsService } from '../service/prestations.service';

@Component({
  selector: 'jhi-prestations-update',
  templateUrl: './prestations-update.component.html',
})
export class PrestationsUpdateComponent implements OnInit {
  isSaving = false;
  prestations: IPrestations | null = null;

  editForm: PrestationsFormGroup = this.prestationsFormService.createPrestationsFormGroup();

  constructor(
    protected prestationsService: PrestationsService,
    protected prestationsFormService: PrestationsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prestations }) => {
      this.prestations = prestations;
      if (prestations) {
        this.updateForm(prestations);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prestations = this.prestationsFormService.getPrestations(this.editForm);
    if (prestations.id !== null) {
      this.subscribeToSaveResponse(this.prestationsService.update(prestations));
    } else {
      this.subscribeToSaveResponse(this.prestationsService.create(prestations));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrestations>>): void {
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

  protected updateForm(prestations: IPrestations): void {
    this.prestations = prestations;
    this.prestationsFormService.resetForm(this.editForm, prestations);
  }
}
