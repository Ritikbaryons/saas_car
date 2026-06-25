import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

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
      next: (res: any) => {
        this.tripDetails = res;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Could not load trip details. The link may be expired or invalid.';
        this.loading = false;
      }
    });
  }

  startTrip() {
    const reading = prompt('Please enter the STARTING Odometer (KM) reading:');
    if (reading === null) return; // User cancelled

    const odometer = parseInt(reading, 10);
    if (isNaN(odometer) || odometer < 0) {
      alert('Please enter a valid numeric value for the odometer.');
      return;
    }

    if (confirm(`Starting Odometer: ${odometer} KM. Start this trip?`)) {
      this.apiService.startDriverTrip(this.token, odometer).subscribe({
        next: (res: any) => {
          alert('Trip started successfully!');
          this.fetchTripDetails(); // Refresh details
        },
        error: (err: any) => {
          alert('Error starting trip.');
        }
      });
    }
  }

  completeTrip() {
    const reading = prompt('Please enter the CLOSING Odometer (KM) reading:');
    if (reading === null) return; // User cancelled

    const odometer = parseInt(reading, 10);
    if (isNaN(odometer) || odometer < 0) {
      alert('Please enter a valid numeric value for the odometer.');
      return;
    }

    if (confirm(`Closing Odometer: ${odometer} KM. Complete this trip?`)) {
      this.apiService.completeDriverTrip(this.token, odometer).subscribe({
        next: (res: any) => {
          alert('Trip completed successfully!');
          this.fetchTripDetails(); // Refresh details
        },
        error: (err: any) => {
          alert('Error completing trip.');
        }
      });
    }
  }
}
