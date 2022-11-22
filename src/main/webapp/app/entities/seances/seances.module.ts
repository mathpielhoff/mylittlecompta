import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SeancesComponent } from './list/seances.component';
import { SeancesDetailComponent } from './detail/seances-detail.component';
import { SeancesUpdateComponent } from './update/seances-update.component';
import { SeancesDeleteDialogComponent } from './delete/seances-delete-dialog.component';
import { SeancesRoutingModule } from './route/seances-routing.module';

@NgModule({
  imports: [SharedModule, SeancesRoutingModule],
  declarations: [SeancesComponent, SeancesDetailComponent, SeancesUpdateComponent, SeancesDeleteDialogComponent],
})
export class SeancesModule {}
