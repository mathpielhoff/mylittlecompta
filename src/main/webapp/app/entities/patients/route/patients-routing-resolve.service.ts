import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatients } from '../patients.model';
import { PatientsService } from '../service/patients.service';

@Injectable({ providedIn: 'root' })
export class PatientsRoutingResolveService implements Resolve<IPatients | null> {
  constructor(protected service: PatientsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatients | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patients: HttpResponse<IPatients>) => {
          if (patients.body) {
            return of(patients.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
