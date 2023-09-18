import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServerModalComponent } from './edit-server-modal.component';

describe('EditServerModalComponent', () => {
  let component: EditServerModalComponent;
  let fixture: ComponentFixture<EditServerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditServerModalComponent]
    });
    fixture = TestBed.createComponent(EditServerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
