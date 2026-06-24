import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-driver-portal',
  templateUrl: './driver-portal.component.html',
  styleUrls: ['./driver-portal.component.scss']
})
export class DriverPortalComponent implements OnInit {
  token: string = '';
  tripDetails: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      if (this.token) {
        this.fetchTripDetails();
      } else {
        this.error = 'Invalid Magic Link Token';
        this.loading = false;
      }
    });
  }

  fetchTripDetails() {
    this.loading = true;
    this.apiService.getDriverTripDetails(this.token).subscribe({
      next: (res) => {
        this.tripDetails = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load trip details. The link may be expired or invalid.';
        this.loading = false;
      }
    });
  }

  startTrip() {
    if (confirm('Are you sure you want to start this trip?')) {
      this.apiService.startDriverTrip(this.token).subscribe({
        next: (res) => {
          alert('Trip started successfully!');
          this.fetchTripDetails(); // Refresh details
        },
        error: (err) => {
          alert('Error starting trip.');
        }
      });
    }
  }
}
