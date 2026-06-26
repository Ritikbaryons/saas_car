import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-driver-live',
  templateUrl: './driver-live.component.html',
  styleUrls: ['./driver-live.component.scss']
})
export class DriverLiveComponent implements OnInit {
  rides: any[] = [];
  currentRide: any;
  loading = true;

  constructor(private api: ApiService, private location: Location) {}

  ngOnInit() {
    this.api.getDriverLiveRides().subscribe({
      next: (res) => {
        this.rides = res || [];
        this.currentRide = this.rides.length > 0 ? this.rides[0] : null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  startRide() {
    if (this.currentRide) {
      this.api.startDriverAppTrip(this.currentRide.id, {}).subscribe(() => {
        this.currentRide.status = 'In Progress';
      });
    }
  }

  endRide() {
    if (this.currentRide) {
      this.api.endDriverAppTrip(this.currentRide.id, {}).subscribe(() => {
        this.currentRide.status = 'Completed';
        this.location.back();
      });
    }
  }
}
