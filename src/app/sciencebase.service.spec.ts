import { TestBed, inject } from "@angular/core/testing";

import { SciencebaseService } from "./sciencebase.service";

describe("SciencebaseService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SciencebaseService],
    });
  });

  it("should be created", inject(
    [SciencebaseService],
    (service: SciencebaseService) => {
      expect(service).toBeTruthy();
    },
  ));
});
