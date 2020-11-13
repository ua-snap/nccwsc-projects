import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchNavComponent } from './search-nav.component';

describe('SearchNavComponent', () => {
  let component: SearchNavComponent;
  let fixture: ComponentFixture<SearchNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
