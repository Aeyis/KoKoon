import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPage } from './class-page';

describe('ClassPage', () => {
  let component: ClassPage;
  let fixture: ComponentFixture<ClassPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
