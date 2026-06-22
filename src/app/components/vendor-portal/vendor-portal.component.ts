import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-vendor-portal',
  templateUrl: './vendor-portal.component.html',
  styleUrl: './vendor-portal.component.scss'
})
export class VendorPortalComponent implements OnInit {
  vendor: any = null;
  vehicles: any[] = [];
  loading: boolean = true;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.loadVendorData(token);
      } else {
        this.errorMsg = 'Invalid magic link. No token found.';
        this.loading = false;
      }
    });
  }

  loadVendorData(token: string) {
    this.apiService.getVendorByToken(token).subscribe({
      next: (v) => {
        this.vendor = v;
        this.apiService.getVendorVehiclesByToken(token).subscribe({
          next: (vh) => {
            this.vehicles = vh;
            this.loading = false;
          },
          error: () => {
            this.errorMsg = 'Could not load your vehicles.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMsg = 'Invalid or expired magic link. Vendor not found.';
        this.loading = false;
      }
    });
  }

  toggleStatus(v: any) {
    const newStatus = v.status === 'Available' ? 'Busy' : 'Available';
    // Optimistic update
    v.status = newStatus;
    
    this.apiService.updateVendorVehicleStatus(this.vendor.magicToken, v.id, newStatus).subscribe({
      error: () => {
        // Revert on error
        v.status = newStatus === 'Available' ? 'Busy' : 'Available';
        alert('Failed to update status. Please try again.');
      }
    });
  }
}
