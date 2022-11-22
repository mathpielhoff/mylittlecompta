import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFactures, NewFactures } from '../factures.model';

export type PartialUpdateFactures = Partial<IFactures> & Pick<IFactures, 'id'>;

type RestOf<T extends IFactures | NewFactures> = Omit<T, 'emissionDate'> & {
  emissionDate?: string | null;
};

export type RestFactures = RestOf<IFactures>;

export type NewRestFactures = RestOf<NewFactures>;

export type PartialUpdateRestFactures = RestOf<PartialUpdateFactures>;

export type EntityResponseType = HttpResponse<IFactures>;
export type EntityArrayResponseType = HttpResponse<IFactures[]>;

@Injectable({ providedIn: 'root' })
export class FacturesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/factures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(factures: NewFactures): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(factures);
    return this.http
      .post<RestFactures>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(factures: IFactures): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(factures);
    return this.http
      .put<RestFactures>(`${this.resourceUrl}/${this.getFacturesIdentifier(factures)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(factures: PartialUpdateFactures): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(factures);
    return this.http
      .patch<RestFactures>(`${this.resourceUrl}/${this.getFacturesIdentifier(factures)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestFactures>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFactures[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFacturesIdentifier(factures: Pick<IFactures, 'id'>): string {
    return factures.id;
  }

  compareFactures(o1: Pick<IFactures, 'id'> | null, o2: Pick<IFactures, 'id'> | null): boolean {
    return o1 && o2 ? this.getFacturesIdentifier(o1) === this.getFacturesIdentifier(o2) : o1 === o2;
  }

  addFacturesToCollectionIfMissing<Type extends Pick<IFactures, 'id'>>(
    facturesCollection: Type[],
    ...facturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const factures: Type[] = facturesToCheck.filter(isPresent);
    if (factures.length > 0) {
      const facturesCollectionIdentifiers = facturesCollection.map(facturesItem => this.getFacturesIdentifier(facturesItem)!);
      const facturesToAdd = factures.filter(facturesItem => {
        const facturesIdentifier = this.getFacturesIdentifier(facturesItem);
        if (facturesCollectionIdentifiers.includes(facturesIdentifier)) {
          return false;
        }
        facturesCollectionIdentifiers.push(facturesIdentifier);
        return true;
      });
      return [...facturesToAdd, ...facturesCollection];
    }
    return facturesCollection;
  }

  protected convertDateFromClient<T extends IFactures | NewFactures | PartialUpdateFactures>(factures: T): RestOf<T> {
    return {
      ...factures,
      emissionDate: factures.emissionDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFactures: RestFactures): IFactures {
    return {
      ...restFactures,
      emissionDate: restFactures.emissionDate ? dayjs(restFactures.emissionDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFactures>): HttpResponse<IFactures> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFactures[]>): HttpResponse<IFactures[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
