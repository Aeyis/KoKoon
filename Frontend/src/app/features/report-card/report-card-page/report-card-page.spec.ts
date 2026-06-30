import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardPage } from './report-card-page';

describe('ReportCardPage', () => {
  let component: ReportCardPage;
  let fixture: ComponentFixture<ReportCardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
