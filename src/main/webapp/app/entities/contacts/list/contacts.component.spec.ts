import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactsService } from '../service/contacts.service';

import { ContactsComponent } from './contacts.component';

describe('Contacts Management Component', () => {
  let comp: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'contacts', component: ContactsComponent }]), HttpClientTestingModule],
      declarations: [ContactsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ContactsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ContactsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.contacts?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to contactsService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getContactsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getContactsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
