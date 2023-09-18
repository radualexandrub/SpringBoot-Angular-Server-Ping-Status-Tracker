import { Component, OnInit } from '@angular/core';
import { ServersComponent } from '../../servers/servers.component';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-server-modal',
  templateUrl: './add-server-modal.component.html',
  styleUrls: ['./add-server-modal.component.css'],
})
export class AddServerModalComponent implements OnInit {
  isServerRequestLoading$: Observable<boolean> | undefined;

  constructor(private serversComponent: ServersComponent) {}

  ngOnInit(): void {
    this.isServerRequestLoading$ =
      this.serversComponent.getIsServerRequestLoading$();
  }

  public onAddServer(addForm: NgForm): void {
    this.serversComponent.onAddServer(addForm);
  }
}
