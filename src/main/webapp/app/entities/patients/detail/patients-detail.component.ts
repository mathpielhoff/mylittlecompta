import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatients } from '../patients.model';

@Component({
  selector: 'jhi-patients-detail',
  templateUrl: './patients-detail.component.html',
})
export class PatientsDetailComponent implements OnInit {
  patients: IPatients | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patients }) => {
      this.patients = patients;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
