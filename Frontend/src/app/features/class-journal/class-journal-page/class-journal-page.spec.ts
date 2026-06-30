import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassJournalPage } from './class-journal-page';

describe('ClassJournalPage', () => {
  let component: ClassJournalPage;
  let fixture: ComponentFixture<ClassJournalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassJournalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassJournalPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
