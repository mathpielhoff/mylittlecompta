import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrestationsDetailComponent } from './prestations-detail.component';

describe('Prestations Management Detail Component', () => {
  let comp: PrestationsDetailComponent;
  let fixture: ComponentFixture<PrestationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrestationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ prestations: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(PrestationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PrestationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load prestations on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.prestations).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
