import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginData = { email: 'owner@tenant1.com', password: 'Password123!' }; // Hardcoded pre-filled values
  loginError = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.loginError = '';
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = err.error || 'Invalid credentials or connection issue.';
      }
    });
  }

  quickLogin(role: string) {
    if (role === 'admin') {
      this.loginData = { email: 'superadmin@fleetflow.com', password: 'Password123!' };
    } else {
      this.loginData = { email: 'owner@tenant1.com', password: 'Password123!' };
    }
    this.onLogin();
  }
}
