import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FacturesDetailComponent } from './factures-detail.component';

describe('Factures Management Detail Component', () => {
  let comp: FacturesDetailComponent;
  let fixture: ComponentFixture<FacturesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ factures: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FacturesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FacturesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load factures on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.factures).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
