import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FacturesComponent } from '../list/factures.component';
import { FacturesDetailComponent } from '../detail/factures-detail.component';
import { FacturesUpdateComponent } from '../update/factures-update.component';
import { FacturesRoutingResolveService } from './factures-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const facturesRoute: Routes = [
  {
    path: '',
    component: FacturesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacturesDetailComponent,
    resolve: {
      factures: FacturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacturesUpdateComponent,
    resolve: {
      factures: FacturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacturesUpdateComponent,
    resolve: {
      factures: FacturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(facturesRoute)],
  exports: [RouterModule],
})
export class FacturesRoutingModule {}
