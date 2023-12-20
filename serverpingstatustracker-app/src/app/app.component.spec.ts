import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  NotifierContainerComponent,
  NotifierModule,
  NotifierService,
} from 'angular-notifier';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServersComponent } from './components/servers/servers.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NotifierModule],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        NotifierContainerComponent,
      ],
      providers: [
        ServersComponent,
        HttpClient,
        HttpHandler,
        { provide: NotifierService, useValue: mockNotifierService },
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
