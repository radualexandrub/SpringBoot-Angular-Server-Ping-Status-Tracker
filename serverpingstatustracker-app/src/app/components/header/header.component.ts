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

  ngOnInit(): void {
    if (localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  onToggleDarkTheme(): void {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

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
