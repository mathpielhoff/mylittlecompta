import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatients, NewPatients } from '../patients.model';

export type PartialUpdatePatients = Partial<IPatients> & Pick<IPatients, 'id'>;

export type EntityResponseType = HttpResponse<IPatients>;
export type EntityArrayResponseType = HttpResponse<IPatients[]>;

@Injectable({ providedIn: 'root' })
export class PatientsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/patients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(patients: NewPatients): Observable<EntityResponseType> {
    return this.http.post<IPatients>(this.resourceUrl, patients, { observe: 'response' });
  }

  update(patients: IPatients): Observable<EntityResponseType> {
    return this.http.put<IPatients>(`${this.resourceUrl}/${this.getPatientsIdentifier(patients)}`, patients, { observe: 'response' });
  }

  partialUpdate(patients: PartialUpdatePatients): Observable<EntityResponseType> {
    return this.http.patch<IPatients>(`${this.resourceUrl}/${this.getPatientsIdentifier(patients)}`, patients, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPatients>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPatients[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPatientsIdentifier(patients: Pick<IPatients, 'id'>): string {
    return patients.id;
  }

  comparePatients(o1: Pick<IPatients, 'id'> | null, o2: Pick<IPatients, 'id'> | null): boolean {
    return o1 && o2 ? this.getPatientsIdentifier(o1) === this.getPatientsIdentifier(o2) : o1 === o2;
  }

  addPatientsToCollectionIfMissing<Type extends Pick<IPatients, 'id'>>(
    patientsCollection: Type[],
    ...patientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const patients: Type[] = patientsToCheck.filter(isPresent);
    if (patients.length > 0) {
      const patientsCollectionIdentifiers = patientsCollection.map(patientsItem => this.getPatientsIdentifier(patientsItem)!);
      const patientsToAdd = patients.filter(patientsItem => {
        const patientsIdentifier = this.getPatientsIdentifier(patientsItem);
        if (patientsCollectionIdentifiers.includes(patientsIdentifier)) {
          return false;
        }
        patientsCollectionIdentifiers.push(patientsIdentifier);
        return true;
      });
      return [...patientsToAdd, ...patientsCollection];
    }
    return patientsCollection;
  }
}
