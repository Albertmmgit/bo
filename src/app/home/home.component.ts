import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName = 'Albert Martínez';
  sidebarOpen = true;

  menuItems = [
    { label: 'Rentings', icon: '🚗', route: '/rentings' },
    { label: 'Carrocería', icon: '🔧', route: '/carroceria' },
    { label: 'Garantías', icon: '🛡️', route: '/garantias' },
    { label: 'Informes', icon: '📊', route: '/informes' },
    { label: 'Administración', icon: '⚙️', route: '/administracion' },
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  openSettings(): void {
    this.router.navigate(['/administracion']);
  }
}
