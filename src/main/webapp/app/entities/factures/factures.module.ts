import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FacturesComponent } from './list/factures.component';
import { FacturesDetailComponent } from './detail/factures-detail.component';
import { FacturesUpdateComponent } from './update/factures-update.component';
import { FacturesDeleteDialogComponent } from './delete/factures-delete-dialog.component';
import { FacturesRoutingModule } from './route/factures-routing.module';

@NgModule({
  imports: [SharedModule, FacturesRoutingModule],
  declarations: [FacturesComponent, FacturesDetailComponent, FacturesUpdateComponent, FacturesDeleteDialogComponent],
})
export class FacturesModule {}
