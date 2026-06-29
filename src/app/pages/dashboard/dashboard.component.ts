import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  editProfile() {
    this.router.navigate(['/profile/edit']);
  }

  deleteAccount() {
    if (confirm('Are you sure? This will permanently delete your account.')) {
      this.profileService.deleteProfile().subscribe({
        next: () => {
          // Account deleted, clear local storage and redirect
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('current_user');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Failed to delete account: ' + (err.error?.message || 'Try again'));
        }
      });
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}