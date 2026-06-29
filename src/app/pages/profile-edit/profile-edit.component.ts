import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  user: User | null = null;
  formData = {
    name: '',
    email: '',
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // Pre-fill form with current user data
    this.formData = {
      name: this.user.name,
      email: this.user.email,
      username: this.user.username,
      password: ''
    };
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Only send fields that were changed
    const updateData: any = {};
    if (this.formData.name !== this.user?.name) {
      updateData.name = this.formData.name;
    }
    if (this.formData.email !== this.user?.email) {
      updateData.email = this.formData.email;
    }
    if (this.formData.username !== this.user?.username) {
      updateData.username = this.formData.username;
    }
    if (this.formData.password) {
      updateData.password = this.formData.password;
    }

    if (Object.keys(updateData).length === 0) {
      this.isLoading = false;
      this.errorMessage = 'No changes made';
      return;
    }

    this.profileService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Update auth service with new user data
        this.authService.updateCurrentUser(response.data);
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update profile';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
