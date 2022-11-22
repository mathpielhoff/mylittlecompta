import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PatientsComponent } from './list/patients.component';
import { PatientsDetailComponent } from './detail/patients-detail.component';
import { PatientsUpdateComponent } from './update/patients-update.component';
import { PatientsDeleteDialogComponent } from './delete/patients-delete-dialog.component';
import { PatientsRoutingModule } from './route/patients-routing.module';

@NgModule({
  imports: [SharedModule, PatientsRoutingModule],
  declarations: [PatientsComponent, PatientsDetailComponent, PatientsUpdateComponent, PatientsDeleteDialogComponent],
})
export class PatientsModule {}
