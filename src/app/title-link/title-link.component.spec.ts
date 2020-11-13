import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TitleLinkComponent } from './title-link.component';

describe('TitleLinkComponent', () => {
  let component: TitleLinkComponent;
  let fixture: ComponentFixture<TitleLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
