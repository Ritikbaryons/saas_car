import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService, UserSession } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: UserSession | null = null;
  dashboardData: any = null;
  activeBookings: any[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboard();
  }

  loadDashboard() {
    this.apiService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => console.error('Dashboard load failed', err)
    });

    this.apiService.getBookings().subscribe({
      next: (data) => {
        // Filter for active bookings
        this.activeBookings = data.filter((b: any) => b.status === 'Assigned' || b.status === 'InProgress');
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }
}
