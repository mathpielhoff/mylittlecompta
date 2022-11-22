import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFactures } from '../factures.model';

@Component({
  selector: 'jhi-factures-detail',
  templateUrl: './factures-detail.component.html',
})
export class FacturesDetailComponent implements OnInit {
  factures: IFactures | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ factures }) => {
      this.factures = factures;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
