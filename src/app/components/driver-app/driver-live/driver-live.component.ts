import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-live',
  template: `
    <h5 class="fw-bold mb-3 mt-2 px-2">Live Rides</h5>
    
    <div *ngIf="rides.length === 0" class="card shadow-sm border-0 rounded-4 p-4 text-center mt-3">
      <i class="bi bi-broadcast text-danger mb-3" style="font-size: 3rem;"></i>
      <h4 class="fw-bold">No Live Ride</h4>
      <p class="text-muted">You don't have any active rides at the moment.</p>
    </div>

    <div *ngFor="let ride of rides" class="card shadow-sm border-0 rounded-4 mb-3 p-3 border-start border-primary border-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-primary px-3 py-2 rounded-pill">{{ ride.status }}</span>
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

      <!-- Button to navigate to Magic Link style UI for Start/End Trip functionality if needed -->
      <a [routerLink]="['/driver-portal', ride.magicToken]" class="btn btn-outline-primary w-100 rounded-pill">Manage Ride</a>
    </div>
  `
})
export class DriverLiveComponent implements OnInit {
  rides: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDriverLiveRides().subscribe(res => {
      this.rides = res;
    });
  }
}
