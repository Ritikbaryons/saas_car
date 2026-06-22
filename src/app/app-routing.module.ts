import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

// Import components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlansComponent } from './components/plans/plans.component';
import { TenantsComponent } from './components/tenants/tenants.component';
import { FleetComponent } from './components/fleet/fleet.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { ReportsComponent } from './components/reports/reports.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { VendorPortalComponent } from './components/vendor-portal/vendor-portal.component';
import { BookinghistoryComponent } from './components/bookinghistory/bookinghistory.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'vendor-portal', component: VendorPortalComponent },
  
  // Protected Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'plans', component: PlansComponent, canActivate: [AuthGuard] },
  { path: 'tenants', component: TenantsComponent, canActivate: [AuthGuard] },
  { path: 'fleet', component: FleetComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'bookinghistory', component: BookinghistoryComponent, canActivate: [AuthGuard] },
  { path: 'vendors', component: VendorsComponent, canActivate: [AuthGuard] },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersRolesComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'general-settings', component: GeneralSettingsComponent, canActivate: [AuthGuard] },
  
  // Wildcard Route
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
