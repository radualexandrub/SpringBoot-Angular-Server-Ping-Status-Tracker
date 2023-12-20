import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { NotifierModule, NotifierService } from 'angular-notifier';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});
    TestBed.configureTestingModule({
      imports: [NotifierModule],
      providers: [{ provide: NotifierService, useValue: mockNotifierService }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
