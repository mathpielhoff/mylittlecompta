import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PatientsFormService, PatientsFormGroup } from './patients-form.service';
import { IPatients } from '../patients.model';
import { PatientsService } from '../service/patients.service';

@Component({
  selector: 'jhi-patients-update',
  templateUrl: './patients-update.component.html',
})
export class PatientsUpdateComponent implements OnInit {
  isSaving = false;
  patients: IPatients | null = null;

  editForm: PatientsFormGroup = this.patientsFormService.createPatientsFormGroup();

  constructor(
    protected patientsService: PatientsService,
    protected patientsFormService: PatientsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patients }) => {
      this.patients = patients;
      if (patients) {
        this.updateForm(patients);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patients = this.patientsFormService.getPatients(this.editForm);
    if (patients.id !== null) {
      this.subscribeToSaveResponse(this.patientsService.update(patients));
    } else {
      this.subscribeToSaveResponse(this.patientsService.create(patients));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatients>>): void {
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

  protected updateForm(patients: IPatients): void {
    this.patients = patients;
    this.patientsFormService.resetForm(this.editForm, patients);
  }
}
