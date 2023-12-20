import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersComponent } from './servers.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { FormsModule } from '@angular/forms';
import { AddServerModalComponent } from '../modals/add-server-modal/add-server-modal.component';
import { EditServerModalComponent } from '../modals/edit-server-modal/edit-server-modal.component';
import { ImportServersModalComponent } from '../modals/import-servers-modal/import-servers-modal.component';

describe('ServersComponent', () => {
  let component: ServersComponent;
  let fixture: ComponentFixture<ServersComponent>;
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});

    TestBed.configureTestingModule({
      imports: [NotifierModule, FormsModule],
      declarations: [
        ServersComponent,
        AddServerModalComponent,
        EditServerModalComponent,
        ImportServersModalComponent,
      ],
      providers: [
        ServersComponent,
        HttpClient,
        HttpHandler,
        { provide: NotifierService, useValue: mockNotifierService },
      ],
    });
    fixture = TestBed.createComponent(ServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
