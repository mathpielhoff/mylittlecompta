import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SeancesService } from '../service/seances.service';

import { SeancesComponent } from './seances.component';

describe('Seances Management Component', () => {
  let comp: SeancesComponent;
  let fixture: ComponentFixture<SeancesComponent>;
  let service: SeancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'seances', component: SeancesComponent }]), HttpClientTestingModule],
      declarations: [SeancesComponent],
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
      .overrideTemplate(SeancesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeancesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SeancesService);

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
    expect(comp.seances?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to seancesService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSeancesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSeancesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
