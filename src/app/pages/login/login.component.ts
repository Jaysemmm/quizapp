import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login({
      email: this.username,  // Backend accepts both username and email in 'email' field
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        const userName = response.data?.user?.name || 'User';
        this.successMessage = 'Welcome, ' + userName + '!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid username or password!';
      }
    });
  }

  togglePassword(): void { 
    this.showPassword = !this.showPassword;
  }
}