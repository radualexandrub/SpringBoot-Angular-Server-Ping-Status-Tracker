import { Component, OnInit } from '@angular/core';
import { ServersComponent } from '../../servers/servers.component';
import { Observable } from 'rxjs';
import { Server } from 'src/app/interfaces/server';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-server-modal',
  templateUrl: './edit-server-modal.component.html',
  styleUrls: ['./edit-server-modal.component.css'],
})
export class EditServerModalComponent implements OnInit {
  isServerRequestLoading$: Observable<boolean> | undefined;
  editServer$: Observable<Server> | undefined;

  constructor(private serversComponent: ServersComponent) {}

  ngOnInit(): void {
    this.isServerRequestLoading$ =
      this.serversComponent.getIsServerRequestLoading$();

    this.editServer$ = this.serversComponent.getEditServer$();
  }

  public onUpdateServer(addForm: NgForm): void {
    this.serversComponent.onUpdateServer(addForm);
  }
}
