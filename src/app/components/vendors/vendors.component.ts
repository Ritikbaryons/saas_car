import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html'
})
export class VendorsComponent implements OnInit {
  vendors: any[] = [];
  vendorVehicles: any[] = [];
  vendorDrivers: any[] = [];
  vendorPayments: any[] = [];
  selectedVendor: any = null;

  newVendor = {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: ''
  };

  newVendorVehicle = {
    partnerId: null as number | null,
    make: '',
    model: '',
    year: 2026,
    plateNumber: '',
    color: ''
  };

  newVendorDriver = {
    partnerId: null as number | null,
    name: '',
    phone: '',
    licenseNumber: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.apiService.getVendors().subscribe({
      next: (data) => this.vendors = data,
      error: (err) => console.error(err)
    });
    this.apiService.getVendorSettlements().subscribe({
      next: (data) => this.vendorPayments = data,
      error: (err) => console.error(err)
    });
  }

  createVendor() {
    this.apiService.createVendor(this.newVendor).subscribe({
      next: () => {
        this.loadVendors();
        this.newVendor = { name: '', contactName: '', email: '', phone: '', address: '' };
      },
      error: (err) => console.error(err)
    });
  }

  selectVendor(v: any) {
    this.selectedVendor = v;
    this.newVendorVehicle.partnerId = v.id;
    this.newVendorDriver.partnerId = v.id;
    
    this.apiService.getVendorVehicles(v.id).subscribe(vh => this.vendorVehicles = vh);
    this.apiService.getVendorDrivers(v.id).subscribe(dr => this.vendorDrivers = dr);
  }

  createVendorVehicle() {
    this.apiService.createVendorVehicle(this.newVendorVehicle).subscribe({
      next: () => {
        this.selectVendor(this.selectedVendor);
        this.newVendorVehicle = {
          partnerId: this.selectedVendor.id,
          make: '',
          model: '',
          year: 2026,
          plateNumber: '',
          color: ''
        };
      },
      error: (err) => console.error(err)
    });
  }

  createVendorDriver() {
    this.apiService.createVendorDriver(this.newVendorDriver).subscribe({
      next: () => {
        this.selectVendor(this.selectedVendor);
        this.newVendorDriver = {
          partnerId: this.selectedVendor.id,
          name: '',
          phone: '',
          licenseNumber: ''
        };
      },
      error: (err) => console.error(err)
    });
  }
}
