import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ProjectResourceComponent } from "./project-resource.component";

describe("ProjectResourceComponent", () => {
  let component: ProjectResourceComponent;
  let fixture: ComponentFixture<ProjectResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectResourceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
