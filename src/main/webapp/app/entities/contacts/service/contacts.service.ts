import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContacts, NewContacts } from '../contacts.model';

export type PartialUpdateContacts = Partial<IContacts> & Pick<IContacts, 'id'>;

export type EntityResponseType = HttpResponse<IContacts>;
export type EntityArrayResponseType = HttpResponse<IContacts[]>;

@Injectable({ providedIn: 'root' })
export class ContactsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contacts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contacts: NewContacts): Observable<EntityResponseType> {
    return this.http.post<IContacts>(this.resourceUrl, contacts, { observe: 'response' });
  }

  update(contacts: IContacts): Observable<EntityResponseType> {
    return this.http.put<IContacts>(`${this.resourceUrl}/${this.getContactsIdentifier(contacts)}`, contacts, { observe: 'response' });
  }

  partialUpdate(contacts: PartialUpdateContacts): Observable<EntityResponseType> {
    return this.http.patch<IContacts>(`${this.resourceUrl}/${this.getContactsIdentifier(contacts)}`, contacts, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IContacts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContacts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getContactsIdentifier(contacts: Pick<IContacts, 'id'>): string {
    return contacts.id;
  }

  compareContacts(o1: Pick<IContacts, 'id'> | null, o2: Pick<IContacts, 'id'> | null): boolean {
    return o1 && o2 ? this.getContactsIdentifier(o1) === this.getContactsIdentifier(o2) : o1 === o2;
  }

  addContactsToCollectionIfMissing<Type extends Pick<IContacts, 'id'>>(
    contactsCollection: Type[],
    ...contactsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const contacts: Type[] = contactsToCheck.filter(isPresent);
    if (contacts.length > 0) {
      const contactsCollectionIdentifiers = contactsCollection.map(contactsItem => this.getContactsIdentifier(contactsItem)!);
      const contactsToAdd = contacts.filter(contactsItem => {
        const contactsIdentifier = this.getContactsIdentifier(contactsItem);
        if (contactsCollectionIdentifiers.includes(contactsIdentifier)) {
          return false;
        }
        contactsCollectionIdentifiers.push(contactsIdentifier);
        return true;
      });
      return [...contactsToAdd, ...contactsCollection];
    }
    return contactsCollection;
  }
}
