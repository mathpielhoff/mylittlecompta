import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrestations } from '../prestations.model';
import { PrestationsService } from '../service/prestations.service';

@Injectable({ providedIn: 'root' })
export class PrestationsRoutingResolveService implements Resolve<IPrestations | null> {
  constructor(protected service: PrestationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrestations | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((prestations: HttpResponse<IPrestations>) => {
          if (prestations.body) {
            return of(prestations.body);
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
