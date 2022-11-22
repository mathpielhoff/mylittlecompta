import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SeancesDetailComponent } from './seances-detail.component';

describe('Seances Management Detail Component', () => {
  let comp: SeancesDetailComponent;
  let fixture: ComponentFixture<SeancesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeancesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ seances: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(SeancesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SeancesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load seances on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.seances).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
