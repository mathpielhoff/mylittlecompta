import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PrestationsComponent } from '../list/prestations.component';
import { PrestationsDetailComponent } from '../detail/prestations-detail.component';
import { PrestationsUpdateComponent } from '../update/prestations-update.component';
import { PrestationsRoutingResolveService } from './prestations-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const prestationsRoute: Routes = [
  {
    path: '',
    component: PrestationsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PrestationsDetailComponent,
    resolve: {
      prestations: PrestationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PrestationsUpdateComponent,
    resolve: {
      prestations: PrestationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PrestationsUpdateComponent,
    resolve: {
      prestations: PrestationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(prestationsRoute)],
  exports: [RouterModule],
})
export class PrestationsRoutingModule {}
