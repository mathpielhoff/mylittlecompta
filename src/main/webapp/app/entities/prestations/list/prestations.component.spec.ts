import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PrestationsService } from '../service/prestations.service';

import { PrestationsComponent } from './prestations.component';

describe('Prestations Management Component', () => {
  let comp: PrestationsComponent;
  let fixture: ComponentFixture<PrestationsComponent>;
  let service: PrestationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'prestations', component: PrestationsComponent }]), HttpClientTestingModule],
      declarations: [PrestationsComponent],
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
      .overrideTemplate(PrestationsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrestationsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PrestationsService);

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
    expect(comp.prestations?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to prestationsService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getPrestationsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPrestationsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
