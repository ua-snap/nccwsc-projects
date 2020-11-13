import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CscComponent } from './csc.component';

describe('CscComponent', () => {
  let component: CscComponent;
  let fixture: ComponentFixture<CscComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
