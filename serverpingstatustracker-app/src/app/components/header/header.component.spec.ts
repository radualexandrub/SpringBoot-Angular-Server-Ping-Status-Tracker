import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ServersComponent } from '../servers/servers.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { FormsModule } from '@angular/forms';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});

    TestBed.configureTestingModule({
      imports: [NotifierModule, FormsModule],
      declarations: [HeaderComponent],
      providers: [
        ServersComponent,
        HttpClient,
        HttpHandler,
        { provide: NotifierService, useValue: mockNotifierService },
      ],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
