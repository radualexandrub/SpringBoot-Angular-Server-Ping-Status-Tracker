import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServerModalComponent } from './edit-server-modal.component';
import { ServersComponent } from '../../servers/servers.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { FormsModule } from '@angular/forms';

describe('EditServerModalComponent', () => {
  let component: EditServerModalComponent;
  let fixture: ComponentFixture<EditServerModalComponent>;
  let mockNotifierService;

  beforeEach(() => {
    mockNotifierService = jasmine.createSpyObj('NotifierService', [
      'notify',
      'getConfig',
    ]);
    mockNotifierService.getConfig = jasmine.createSpy().and.returnValue({});
    TestBed.configureTestingModule({
      imports: [NotifierModule, FormsModule],
      declarations: [EditServerModalComponent],
      providers: [
        ServersComponent,
        HttpClient,
        HttpHandler,
        { provide: NotifierService, useValue: mockNotifierService },
      ],
    });
    fixture = TestBed.createComponent(EditServerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
