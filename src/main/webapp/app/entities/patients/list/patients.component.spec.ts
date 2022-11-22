import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PatientsService } from '../service/patients.service';

import { PatientsComponent } from './patients.component';

describe('Patients Management Component', () => {
  let comp: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;
  let service: PatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'patients', component: PatientsComponent }]), HttpClientTestingModule],
      declarations: [PatientsComponent],
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
      .overrideTemplate(PatientsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PatientsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PatientsService);

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
    expect(comp.patients?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to patientsService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getPatientsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPatientsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
