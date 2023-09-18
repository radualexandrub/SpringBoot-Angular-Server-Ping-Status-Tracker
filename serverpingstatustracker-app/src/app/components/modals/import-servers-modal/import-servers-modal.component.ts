import { Component, OnInit } from '@angular/core';
import { ServersComponent } from '../../servers/servers.component';

@Component({
  selector: 'app-import-servers-modal',
  templateUrl: './import-servers-modal.component.html',
  styleUrls: ['./import-servers-modal.component.css'],
})
export class ImportServersModalComponent implements OnInit {
  constructor(private serversComponent: ServersComponent) {}

  ngOnInit(): void {}

  public onImportListAsJSON(event: Event): void {
    this.serversComponent.onImportListAsJSON(event);
  }
}
