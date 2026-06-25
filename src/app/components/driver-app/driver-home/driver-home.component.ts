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

    <!-- Upcoming Rides Section -->
    <h5 class="fw-bold mb-3 mt-4 px-2" *ngIf="data?.upcomingRides?.length > 0">Upcoming Rides</h5>
    
    <div *ngFor="let ride of data?.upcomingRides" class="card shadow-sm border-0 rounded-4 mb-3 p-3 border-start border-warning border-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">{{ ride.status }}</span>
        <small class="text-muted fw-bold">{{ ride.scheduledStart | date:'shortTime' }}</small>
      </div>
      
      <h5 class="fw-bold text-dark mt-2">{{ ride.customerName }}</h5>
      <p class="text-muted mb-3"><i class="bi bi-telephone-fill me-2"></i>{{ ride.customerPhone }}</p>

      <div class="d-flex align-items-start mb-2">
        <i class="bi bi-geo-alt-fill text-success mt-1 me-2 fs-5"></i>
        <div><small class="text-muted d-block">Pickup</small><span class="fw-semibold">{{ ride.pickup }}</span></div>
      </div>
      
      <div class="d-flex align-items-start mb-3">
        <i class="bi bi-geo-fill text-danger mt-1 me-2 fs-5"></i>
        <div><small class="text-muted d-block">Drop</small><span class="fw-semibold">{{ ride.drop }}</span></div>
      </div>

      <div class="p-2 bg-light rounded-3 small mb-3">
        <i class="bi bi-car-front-fill text-secondary me-2"></i> {{ ride.carDetails }}
      </div>

      <a [routerLink]="['/driver/manage', ride.magicToken]" class="btn btn-outline-warning text-dark fw-bold w-100 rounded-pill">Manage Ride</a>
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
