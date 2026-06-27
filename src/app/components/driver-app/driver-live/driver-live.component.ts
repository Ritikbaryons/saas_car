import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-driver-live',
  templateUrl: './driver-live.component.html',
  styleUrls: ['./driver-live.component.scss']
})
export class DriverLiveComponent implements OnInit {
  rides: any[] = [];
  currentRide: any;
  loading = true;
  mapUrl: SafeResourceUrl | null = null;

  constructor(private api: ApiService, private location: Location, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.api.getDriverLiveRides().subscribe({
      next: (res) => {
        this.rides = res || [];
        this.currentRide = this.rides.length > 0 ? this.rides[0] : null;
        if (this.currentRide && this.currentRide.pickupLat && this.currentRide.pickupLng) {
          const lat = this.currentRide.pickupLat;
          const lng = this.currentRide.pickupLng;
          const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
          this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
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
      this.api.startDriverAppTrip(this.currentRide.bookingVehicleId, {}).subscribe(() => {
        this.currentRide.status = 'InProgress';
      });
    }
  }

  endRide() {
    if (this.currentRide) {
      this.api.endDriverAppTrip(this.currentRide.bookingVehicleId, {}).subscribe(() => {
        this.currentRide.status = 'Completed';
        this.location.back();
      });
    }
  }
}
