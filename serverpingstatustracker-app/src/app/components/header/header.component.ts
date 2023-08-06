import { Component, OnInit } from '@angular/core';
import { Server } from 'src/app/interfaces/server';
import { ServersComponent } from '../servers/servers.component';
import { Router } from '@angular/router';

/**
 * @author Radu-Alexandru Bulai
 * @version 1.0.0
 * @since 26/07/2023
 */
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

  public accentColor: any = localStorage.getItem('accent-color')
    ? localStorage.getItem('accent-color')
    : '#456778';

  ngOnInit(): void {
    // Get Dark Mode Toggle from Local Storage
    if (localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    // Get Accent Color from Local Storage
    if (localStorage.getItem('accent-color') !== null) {
      this.onSetAccentColor(localStorage.getItem('accent-color'));
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

  onToggleAccentColor() {
    document.getElementById('accentColorInput')?.click();
  }

  onChangeAccentColor(colorValueEvent: any) {
    this.onSetAccentColor(colorValueEvent.target.value);
  }

  onSetAccentColor(primaryColor: any) {
    const [h, s, l] = this.rgbToHsl(
      parseInt(primaryColor.substring(1, 3), 16),
      parseInt(primaryColor.substring(3, 5), 16),
      parseInt(primaryColor.substring(5, 7), 16)
    );
    const secondaryLuminance = l - 0.15; // Reduce luminance by 15% for the secondary color
    const secondaryColor = `hsl(${h * 360}, ${s * 100}%, ${Math.min(
      Math.max(secondaryLuminance * 100, 0),
      100
    )}%)`;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty(
      '--secondary-color',
      secondaryColor
    );
    localStorage.setItem('accent-color', primaryColor);
  }

  rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  };

  hasRoute(route: string): boolean {
    return this.router.url === route;
  }

  hasRouteIncluded(route: string): boolean {
    return this.router.url.includes(route);
  }
}
