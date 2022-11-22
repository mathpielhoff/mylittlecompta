import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeances } from '../seances.model';

@Component({
  selector: 'jhi-seances-detail',
  templateUrl: './seances-detail.component.html',
})
export class SeancesDetailComponent implements OnInit {
  seances: ISeances | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seances }) => {
      this.seances = seances;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
