import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'factures',
        data: { pageTitle: 'myLittleComptaApp.factures.home.title' },
        loadChildren: () => import('./factures/factures.module').then(m => m.FacturesModule),
      },
      {
        path: 'patients',
        data: { pageTitle: 'myLittleComptaApp.patients.home.title' },
        loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
      },
      {
        path: 'contacts',
        data: { pageTitle: 'myLittleComptaApp.contacts.home.title' },
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'prestations',
        data: { pageTitle: 'myLittleComptaApp.prestations.home.title' },
        loadChildren: () => import('./prestations/prestations.module').then(m => m.PrestationsModule),
      },
      {
        path: 'seances',
        data: { pageTitle: 'myLittleComptaApp.seances.home.title' },
        loadChildren: () => import('./seances/seances.module').then(m => m.SeancesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
