import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrestations } from '../prestations.model';

@Component({
  selector: 'jhi-prestations-detail',
  templateUrl: './prestations-detail.component.html',
})
export class PrestationsDetailComponent implements OnInit {
  prestations: IPrestations | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prestations }) => {
      this.prestations = prestations;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
