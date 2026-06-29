import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.css'
})
export class MainLayoutComponent implements OnInit {
  user: User | null = null;
  sidebarOpen = true;
  activeMenu = 'dashboard';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const user = this.authService.getUser();
    if (user) {
      this.user = user;
    } else {
      // Subscribe to reactive updates
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.user = user;
      });
    }
  }

  navigateTo(menu: string, route: string): void {
    this.activeMenu = menu;
    this.router.navigate([route]);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          // Still clear local data and redirect on error
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('current_user');
          this.router.navigate(['/login']);
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
