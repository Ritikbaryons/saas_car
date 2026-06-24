import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-history',
  template: `
    <h5 class="fw-bold mb-3 mt-2 px-2">Trip History</h5>

    <div *ngIf="history.length === 0" class="card shadow-sm border-0 rounded-4 p-4 text-center mt-3">
      <i class="bi bi-journal-check text-success mb-3" style="font-size: 3rem;"></i>
      <h4 class="fw-bold">No History</h4>
      <p class="text-muted">You haven't completed any trips yet.</p>
    </div>

    <div *ngFor="let trip of history" class="card shadow-sm border-0 rounded-4 mb-3 p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge" [ngClass]="trip.status === 'Completed' ? 'bg-success' : 'bg-danger'">{{ trip.status }}</span>
        <small class="text-muted fw-bold">{{ trip.date | date:'mediumDate' }}</small>
      </div>

      <div class="d-flex align-items-start mb-2 mt-2">
        <i class="bi bi-geo-alt text-muted mt-1 me-2"></i>
        <small class="text-dark">{{ trip.pickup }}</small>
      </div>
      
      <div class="d-flex align-items-start">
        <i class="bi bi-geo text-muted mt-1 me-2"></i>
        <small class="text-dark">{{ trip.drop }}</small>
      </div>
    </div>
  `
})
export class DriverHistoryComponent implements OnInit {
  history: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDriverHistory().subscribe(res => {
      this.history = res;
    });
  }
}
