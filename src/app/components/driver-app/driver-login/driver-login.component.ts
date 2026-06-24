import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.component.html',
  styleUrls: ['./driver-login.component.scss']
})
export class DriverLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        // Proceed to Driver Home page
        this.router.navigate(['/driver/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid credentials. Please verify your email and password.';
      }
    });
  }
}
