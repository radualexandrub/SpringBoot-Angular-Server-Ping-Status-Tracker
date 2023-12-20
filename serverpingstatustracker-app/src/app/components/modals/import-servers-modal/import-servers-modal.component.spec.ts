import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportServersModalComponent } from './import-servers-modal.component';
import { ServersComponent } from '../../servers/servers.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { FormsModule } from '@angular/forms';

describe('ImportServersModalComponent', () => {
  let component: ImportServersModalComponent;
  let fixture: ComponentFixture<ImportServersModalComponent>;
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});
    TestBed.configureTestingModule({
      imports: [NotifierModule, FormsModule],
      declarations: [ImportServersModalComponent],
      providers: [
        ServersComponent,
        HttpClient,
        HttpHandler,
        { provide: NotifierService, useValue: mockNotifierService },
      ],
    });
    fixture = TestBed.createComponent(ImportServersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
