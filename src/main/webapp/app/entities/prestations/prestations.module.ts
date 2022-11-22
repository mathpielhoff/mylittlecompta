import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PrestationsComponent } from './list/prestations.component';
import { PrestationsDetailComponent } from './detail/prestations-detail.component';
import { PrestationsUpdateComponent } from './update/prestations-update.component';
import { PrestationsDeleteDialogComponent } from './delete/prestations-delete-dialog.component';
import { PrestationsRoutingModule } from './route/prestations-routing.module';

@NgModule({
  imports: [SharedModule, PrestationsRoutingModule],
  declarations: [PrestationsComponent, PrestationsDetailComponent, PrestationsUpdateComponent, PrestationsDeleteDialogComponent],
})
export class PrestationsModule {}
