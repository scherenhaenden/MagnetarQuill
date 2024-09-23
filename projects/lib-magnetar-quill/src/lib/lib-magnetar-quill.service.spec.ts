import { TestBed } from '@angular/core/testing';

import { LibMagnetarQuillService } from './lib-magnetar-quill.service';

describe('LibMagnetarQuillService', () => {
  let service: LibMagnetarQuillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibMagnetarQuillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
