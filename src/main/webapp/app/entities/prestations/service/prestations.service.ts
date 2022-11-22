import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrestations, NewPrestations } from '../prestations.model';

export type PartialUpdatePrestations = Partial<IPrestations> & Pick<IPrestations, 'id'>;

export type EntityResponseType = HttpResponse<IPrestations>;
export type EntityArrayResponseType = HttpResponse<IPrestations[]>;

@Injectable({ providedIn: 'root' })
export class PrestationsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prestations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prestations: NewPrestations): Observable<EntityResponseType> {
    return this.http.post<IPrestations>(this.resourceUrl, prestations, { observe: 'response' });
  }

  update(prestations: IPrestations): Observable<EntityResponseType> {
    return this.http.put<IPrestations>(`${this.resourceUrl}/${this.getPrestationsIdentifier(prestations)}`, prestations, {
      observe: 'response',
    });
  }

  partialUpdate(prestations: PartialUpdatePrestations): Observable<EntityResponseType> {
    return this.http.patch<IPrestations>(`${this.resourceUrl}/${this.getPrestationsIdentifier(prestations)}`, prestations, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPrestations>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrestations[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPrestationsIdentifier(prestations: Pick<IPrestations, 'id'>): string {
    return prestations.id;
  }

  comparePrestations(o1: Pick<IPrestations, 'id'> | null, o2: Pick<IPrestations, 'id'> | null): boolean {
    return o1 && o2 ? this.getPrestationsIdentifier(o1) === this.getPrestationsIdentifier(o2) : o1 === o2;
  }

  addPrestationsToCollectionIfMissing<Type extends Pick<IPrestations, 'id'>>(
    prestationsCollection: Type[],
    ...prestationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const prestations: Type[] = prestationsToCheck.filter(isPresent);
    if (prestations.length > 0) {
      const prestationsCollectionIdentifiers = prestationsCollection.map(
        prestationsItem => this.getPrestationsIdentifier(prestationsItem)!
      );
      const prestationsToAdd = prestations.filter(prestationsItem => {
        const prestationsIdentifier = this.getPrestationsIdentifier(prestationsItem);
        if (prestationsCollectionIdentifiers.includes(prestationsIdentifier)) {
          return false;
        }
        prestationsCollectionIdentifiers.push(prestationsIdentifier);
        return true;
      });
      return [...prestationsToAdd, ...prestationsCollection];
    }
    return prestationsCollection;
  }
}
