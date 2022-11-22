import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeancesComponent } from '../list/seances.component';
import { SeancesDetailComponent } from '../detail/seances-detail.component';
import { SeancesUpdateComponent } from '../update/seances-update.component';
import { SeancesRoutingResolveService } from './seances-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const seancesRoute: Routes = [
  {
    path: '',
    component: SeancesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeancesDetailComponent,
    resolve: {
      seances: SeancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeancesUpdateComponent,
    resolve: {
      seances: SeancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SeancesUpdateComponent,
    resolve: {
      seances: SeancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seancesRoute)],
  exports: [RouterModule],
})
export class SeancesRoutingModule {}
