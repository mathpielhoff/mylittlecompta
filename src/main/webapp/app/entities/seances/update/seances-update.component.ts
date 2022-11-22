import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SeancesFormService, SeancesFormGroup } from './seances-form.service';
import { ISeances } from '../seances.model';
import { SeancesService } from '../service/seances.service';
import { IPrestations } from 'app/entities/prestations/prestations.model';
import { PrestationsService } from 'app/entities/prestations/service/prestations.service';
import { IPatients } from 'app/entities/patients/patients.model';
import { PatientsService } from 'app/entities/patients/service/patients.service';
import { IFactures } from 'app/entities/factures/factures.model';
import { FacturesService } from 'app/entities/factures/service/factures.service';

@Component({
  selector: 'jhi-seances-update',
  templateUrl: './seances-update.component.html',
})
export class SeancesUpdateComponent implements OnInit {
  isSaving = false;
  seances: ISeances | null = null;

  prestationsCollection: IPrestations[] = [];
  patientsSharedCollection: IPatients[] = [];
  facturesSharedCollection: IFactures[] = [];

  editForm: SeancesFormGroup = this.seancesFormService.createSeancesFormGroup();

  constructor(
    protected seancesService: SeancesService,
    protected seancesFormService: SeancesFormService,
    protected prestationsService: PrestationsService,
    protected patientsService: PatientsService,
    protected facturesService: FacturesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePrestations = (o1: IPrestations | null, o2: IPrestations | null): boolean => this.prestationsService.comparePrestations(o1, o2);

  comparePatients = (o1: IPatients | null, o2: IPatients | null): boolean => this.patientsService.comparePatients(o1, o2);

  compareFactures = (o1: IFactures | null, o2: IFactures | null): boolean => this.facturesService.compareFactures(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seances }) => {
      this.seances = seances;
      if (seances) {
        this.updateForm(seances);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const seances = this.seancesFormService.getSeances(this.editForm);
    if (seances.id !== null) {
      this.subscribeToSaveResponse(this.seancesService.update(seances));
    } else {
      this.subscribeToSaveResponse(this.seancesService.create(seances));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeances>>): void {
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

  protected updateForm(seances: ISeances): void {
    this.seances = seances;
    this.seancesFormService.resetForm(this.editForm, seances);

    this.prestationsCollection = this.prestationsService.addPrestationsToCollectionIfMissing<IPrestations>(
      this.prestationsCollection,
      seances.prestations
    );
    this.patientsSharedCollection = this.patientsService.addPatientsToCollectionIfMissing<IPatients>(
      this.patientsSharedCollection,
      seances.patients
    );
    this.facturesSharedCollection = this.facturesService.addFacturesToCollectionIfMissing<IFactures>(
      this.facturesSharedCollection,
      seances.factures
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prestationsService
      .query({ filter: 'seances-is-null' })
      .pipe(map((res: HttpResponse<IPrestations[]>) => res.body ?? []))
      .pipe(
        map((prestations: IPrestations[]) =>
          this.prestationsService.addPrestationsToCollectionIfMissing<IPrestations>(prestations, this.seances?.prestations)
        )
      )
      .subscribe((prestations: IPrestations[]) => (this.prestationsCollection = prestations));

    this.patientsService
      .query()
      .pipe(map((res: HttpResponse<IPatients[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatients[]) => this.patientsService.addPatientsToCollectionIfMissing<IPatients>(patients, this.seances?.patients))
      )
      .subscribe((patients: IPatients[]) => (this.patientsSharedCollection = patients));

    this.facturesService
      .query()
      .pipe(map((res: HttpResponse<IFactures[]>) => res.body ?? []))
      .pipe(
        map((factures: IFactures[]) => this.facturesService.addFacturesToCollectionIfMissing<IFactures>(factures, this.seances?.factures))
      )
      .subscribe((factures: IFactures[]) => (this.facturesSharedCollection = factures));
  }
}
