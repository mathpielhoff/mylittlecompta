import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatientsComponent } from '../list/patients.component';
import { PatientsDetailComponent } from '../detail/patients-detail.component';
import { PatientsUpdateComponent } from '../update/patients-update.component';
import { PatientsRoutingResolveService } from './patients-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const patientsRoute: Routes = [
  {
    path: '',
    component: PatientsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PatientsDetailComponent,
    resolve: {
      patients: PatientsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PatientsUpdateComponent,
    resolve: {
      patients: PatientsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PatientsUpdateComponent,
    resolve: {
      patients: PatientsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patientsRoute)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
