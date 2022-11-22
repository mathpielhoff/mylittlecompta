import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrestations } from '../prestations.model';
import { PrestationsService } from '../service/prestations.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './prestations-delete-dialog.component.html',
})
export class PrestationsDeleteDialogComponent {
  prestations?: IPrestations;

  constructor(protected prestationsService: PrestationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.prestationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
