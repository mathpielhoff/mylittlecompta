import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FacturesService } from '../service/factures.service';

import { FacturesComponent } from './factures.component';

describe('Factures Management Component', () => {
  let comp: FacturesComponent;
  let fixture: ComponentFixture<FacturesComponent>;
  let service: FacturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'factures', component: FacturesComponent }]), HttpClientTestingModule],
      declarations: [FacturesComponent],
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
      .overrideTemplate(FacturesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FacturesService);

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
    expect(comp.factures?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to facturesService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getFacturesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFacturesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
