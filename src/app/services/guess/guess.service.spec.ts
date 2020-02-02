import { TestBed } from '@angular/core/testing';

import { GuessService } from './guess.service';

describe('GuessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuessService = TestBed.get(GuessService);
    expect(service).toBeTruthy();
  });
});
