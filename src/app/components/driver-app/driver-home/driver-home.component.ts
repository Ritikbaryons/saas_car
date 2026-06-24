import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-home',
  template: `
    <div class="card shadow-sm border-0 rounded-4 p-4 text-center mt-3">
      <i class="bi bi-car-front-fill text-primary mb-3" style="font-size: 3rem;"></i>
      <h4 class="fw-bold">Welcome, Driver!</h4>
      <p class="text-muted mb-4">You are successfully logged in. Here is your summary for today.</p>

      <div class="row g-3">
        <div class="col-6">
          <div class="p-3 bg-light rounded-3">
            <h2 class="text-primary mb-0">{{ data?.activeTrips || 0 }}</h2>
            <small class="text-muted">Active Trips</small>
          </div>
        </div>
        <div class="col-6">
          <div class="p-3 bg-light rounded-3">
            <h2 class="text-success mb-0">{{ data?.completedTrips || 0 }}</h2>
            <small class="text-muted">Completed</small>
          </div>
        </div>
        <div class="col-12 mt-3">
          <div class="p-3 rounded-3" [ngClass]="data?.isCheckedIn ? 'bg-success text-white' : 'bg-warning text-dark'">
            <h5 class="mb-0">
              <i class="bi" [ngClass]="data?.isCheckedIn ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'"></i>
              {{ data?.isCheckedIn ? 'Attendance Punched In' : 'Attendance Pending' }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DriverHomeComponent implements OnInit {
  data: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDriverHome().subscribe(res => {
      this.data = res;
    });
  }
}
