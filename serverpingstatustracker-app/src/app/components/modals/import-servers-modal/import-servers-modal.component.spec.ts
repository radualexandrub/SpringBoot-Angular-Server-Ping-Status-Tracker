import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportServersModalComponent } from './import-servers-modal.component';

describe('ImportServersModalComponent', () => {
  let component: ImportServersModalComponent;
  let fixture: ComponentFixture<ImportServersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportServersModalComponent]
    });
    fixture = TestBed.createComponent(ImportServersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
