import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISeances, NewSeances } from '../seances.model';

export type PartialUpdateSeances = Partial<ISeances> & Pick<ISeances, 'id'>;

type RestOf<T extends ISeances | NewSeances> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestSeances = RestOf<ISeances>;

export type NewRestSeances = RestOf<NewSeances>;

export type PartialUpdateRestSeances = RestOf<PartialUpdateSeances>;

export type EntityResponseType = HttpResponse<ISeances>;
export type EntityArrayResponseType = HttpResponse<ISeances[]>;

@Injectable({ providedIn: 'root' })
export class SeancesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/seances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(seances: NewSeances): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seances);
    return this.http
      .post<RestSeances>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(seances: ISeances): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seances);
    return this.http
      .put<RestSeances>(`${this.resourceUrl}/${this.getSeancesIdentifier(seances)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(seances: PartialUpdateSeances): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(seances);
    return this.http
      .patch<RestSeances>(`${this.resourceUrl}/${this.getSeancesIdentifier(seances)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestSeances>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSeances[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSeancesIdentifier(seances: Pick<ISeances, 'id'>): string {
    return seances.id;
  }

  compareSeances(o1: Pick<ISeances, 'id'> | null, o2: Pick<ISeances, 'id'> | null): boolean {
    return o1 && o2 ? this.getSeancesIdentifier(o1) === this.getSeancesIdentifier(o2) : o1 === o2;
  }

  addSeancesToCollectionIfMissing<Type extends Pick<ISeances, 'id'>>(
    seancesCollection: Type[],
    ...seancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const seances: Type[] = seancesToCheck.filter(isPresent);
    if (seances.length > 0) {
      const seancesCollectionIdentifiers = seancesCollection.map(seancesItem => this.getSeancesIdentifier(seancesItem)!);
      const seancesToAdd = seances.filter(seancesItem => {
        const seancesIdentifier = this.getSeancesIdentifier(seancesItem);
        if (seancesCollectionIdentifiers.includes(seancesIdentifier)) {
          return false;
        }
        seancesCollectionIdentifiers.push(seancesIdentifier);
        return true;
      });
      return [...seancesToAdd, ...seancesCollection];
    }
    return seancesCollection;
  }

  protected convertDateFromClient<T extends ISeances | NewSeances | PartialUpdateSeances>(seances: T): RestOf<T> {
    return {
      ...seances,
      date: seances.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSeances: RestSeances): ISeances {
    return {
      ...restSeances,
      date: restSeances.date ? dayjs(restSeances.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSeances>): HttpResponse<ISeances> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSeances[]>): HttpResponse<ISeances[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
