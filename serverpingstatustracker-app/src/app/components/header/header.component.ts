import { Component, OnInit } from '@angular/core';
import { Server } from 'src/app/interfaces/server';
import { ServersComponent } from '../servers/servers.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private serversComponent: ServersComponent,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onOpenModal(server: Server, modalMode: string): void {
    this.serversComponent.onOpenModal(server, modalMode);
  }

  hasRoute(route: string): boolean {
    return this.router.url === route;
  }

  hasRouteIncluded(route: string): boolean {
    return this.router.url.includes(route);
  }
}
