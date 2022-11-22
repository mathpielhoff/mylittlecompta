import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatientsDetailComponent } from './patients-detail.component';

describe('Patients Management Detail Component', () => {
  let comp: PatientsDetailComponent;
  let fixture: ComponentFixture<PatientsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ patients: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(PatientsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PatientsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load patients on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.patients).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
