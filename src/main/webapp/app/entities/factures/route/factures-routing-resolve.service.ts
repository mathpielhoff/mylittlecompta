import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFactures } from '../factures.model';
import { FacturesService } from '../service/factures.service';

@Injectable({ providedIn: 'root' })
export class FacturesRoutingResolveService implements Resolve<IFactures | null> {
  constructor(protected service: FacturesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFactures | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((factures: HttpResponse<IFactures>) => {
          if (factures.body) {
            return of(factures.body);
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
