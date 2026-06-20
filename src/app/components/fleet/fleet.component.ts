import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html'
})
export class FleetComponent implements OnInit {
  cars: any[] = [];
  drivers: any[] = [];

  newCar = {
    make: '',
    model: '',
    year: 2026,
    plateNumber: '',
    color: '',
    status: 'Available',
    insuranceExpiry: '',
    nextMaintenanceDate: '',
    isOwnVehicle: true,
    baseRate: 0
  };

  newDriver = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    status: 'Available',
    createLogin: false
  };

  carError = '';
  driverError = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCars();
    this.loadDrivers();
  }

  loadCars() {
    this.apiService.getCars().subscribe({
      next: (data) => this.cars = data,
      error: (err) => console.error('Failed to load fleet', err)
    });
  }

  createCar() {
    this.carError = '';
    
    // Convert empty string dates to null for the backend
    const payload = { ...this.newCar };
    if (!payload.insuranceExpiry) delete (payload as any).insuranceExpiry;
    if (!payload.nextMaintenanceDate) delete (payload as any).nextMaintenanceDate;

    this.apiService.createCar(payload).subscribe({
      next: () => {
        this.loadCars();
        this.newCar = {
          make: '',
          model: '',
          year: 2026,
          plateNumber: '',
          color: '',
          status: 'Available',
          insuranceExpiry: '',
          nextMaintenanceDate: '',
          isOwnVehicle: true,
          baseRate: 0
        };
      },
      error: (err) => {
        let msg = 'Failed to add vehicle to fleet.';
        if (typeof err.error === 'string') msg = err.error;
        else if (err.error?.title) msg = err.error.title;
        else if (err.error?.message) msg = err.error.message;
        this.carError = msg;
      }
    });
  }

  deleteCar(id: number) {
    if (confirm('Remove this vehicle from your fleet inventory?')) {
      this.apiService.deleteCar(id).subscribe({
        next: () => this.loadCars(),
        error: (err) => console.error('Failed to delete car', err)
      });
    }
  }

  loadDrivers() {
    this.apiService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Failed to load drivers', err)
    });
  }

  createDriver() {
    this.driverError = '';
    
    // Convert empty string dates to null for the backend
    const payload = { ...this.newDriver };
    if (!payload.licenseExpiry) delete (payload as any).licenseExpiry;

    this.apiService.createDriver(payload).subscribe({
      next: () => {
        this.loadDrivers();
        this.newDriver = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: '',
          status: 'Available',
          createLogin: false
        };
      },
      error: (err) => {
        let msg = 'Failed to save driver details.';
        if (typeof err.error === 'string') msg = err.error;
        else if (err.error?.title) msg = err.error.title;
        else if (err.error?.message) msg = err.error.message;
        this.driverError = msg;
      }
    });
  }

  deleteDriver(id: number) {
    if (confirm('Remove this driver from your payroll/active operators?')) {
      this.apiService.deleteDriver(id).subscribe({
        next: () => this.loadDrivers(),
        error: (err) => console.error('Failed to delete driver', err)
      });
    }
  }
}
