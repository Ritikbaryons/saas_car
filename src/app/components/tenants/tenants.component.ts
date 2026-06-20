import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnInit {
  tenants: any[] = [];
  plans: any[] = [];
  
  // Provisioning form data (replaces old register form)
  newTenant = {
    companyName: '',
    domain: '',
    planId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTenants();
    this.loadPlans();
  }

  loadTenants() {
    this.apiService.getTenants().subscribe({
      next: (data) => this.tenants = data,
      error: (err) => console.error('Failed to load tenants', err)
    });
  }

  loadPlans() {
    this.apiService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        if (data.length > 0) {
          this.newTenant.planId = data[0].id;
        }
      },
      error: (err) => console.error('Failed to load plans', err)
    });
  }

  provisionTenant() {
    this.successMsg = '';
    this.errorMsg = '';
    // Send to register endpoint to provision tenant and company admin account
    this.authService.register(this.newTenant).subscribe({
      next: () => {
        this.successMsg = `Tenant company "${this.newTenant.companyName}" provisioned successfully!`;
        this.loadTenants();
        this.newTenant = {
          companyName: '',
          domain: '',
          planId: this.plans[0]?.id || '',
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        };
      },
      error: (err) => {
        this.errorMsg = err.error || 'Failed to provision tenant space.';
      }
    });
  }

  deleteTenant(id: number) {
    if (confirm('Are you sure you want to suspend/deactivate this tenant company?')) {
      this.apiService.deleteTenant(id).subscribe({
        next: () => this.loadTenants(),
        error: (err) => console.error('Failed to delete tenant', err)
      });
    }
  }
}
