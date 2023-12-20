import { TestBed } from '@angular/core/testing';

import { ServerService } from './server.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ServerService', () => {
  let service: ServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(ServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
