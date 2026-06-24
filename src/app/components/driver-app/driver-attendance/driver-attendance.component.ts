import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-attendance',
  template: `
    <h5 class="fw-bold mb-3 mt-2 px-2">Daily Attendance</h5>

    <div class="card shadow-sm border-0 rounded-4 p-4 text-center mt-3">
      <i class="bi bi-calendar-check-fill text-warning mb-3" style="font-size: 3rem;"></i>
      <h4 class="fw-bold">{{ today | date:'fullDate' }}</h4>
      <p class="text-muted">Mark your daily presence to start getting assigned trips.</p>
      
      <div *ngIf="message" class="alert alert-success mt-2 p-2 small">{{ message }}</div>

      <button class="btn rounded-pill btn-lg mt-3 w-100 fw-bold shadow-sm" 
              [ngClass]="isCheckedIn ? 'btn-danger' : 'btn-primary'"
              (click)="punchAttendance()" 
              [disabled]="loading || isCheckedOut">
        
        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi me-2" [ngClass]="isCheckedIn ? 'bi-box-arrow-right' : 'bi-box-arrow-in-right'"></i>
        
        {{ isCheckedOut ? 'Duty Completed' : (isCheckedIn ? 'Punch Out' : 'Punch In') }}
      </button>
    </div>
  `
})
export class DriverAttendanceComponent implements OnInit {
  today = new Date();
  loading = false;
  isCheckedIn = false;
  isCheckedOut = false;
  message = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.api.getDriverHome().subscribe(res => {
      this.isCheckedIn = res.isCheckedIn;
      this.isCheckedOut = res.isCheckedOut;
    });
  }

  punchAttendance() {
    this.loading = true;
    this.message = '';
    this.api.punchDriverAttendance().subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message;
        this.loadStatus();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error || 'Failed to punch attendance');
      }
    });
  }
}
