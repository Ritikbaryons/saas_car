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
import { DutyTypesComponent } from './components/duty-types/duty-types.component';

import { ExpensesComponent } from './components/expenses/expenses.component';
import { DriverPortalComponent } from './components/driver-app/driver-portal/driver-portal.component';
import { DriverLoginComponent } from './components/driver-app/driver-login/driver-login.component';
import { DriverLayoutComponent } from './components/driver-app/driver-layout/driver-layout.component';
import { DriverHomeComponent } from './components/driver-app/driver-home/driver-home.component';
import { DriverLiveComponent } from './components/driver-app/driver-live/driver-live.component';
import { DriverHistoryComponent } from './components/driver-app/driver-history/driver-history.component';
import { DriverAttendanceComponent } from './components/driver-app/driver-attendance/driver-attendance.component';

import { DriverProfileComponent } from './components/driver-app/driver-profile/driver-profile.component';
import { DriverAlertsComponent } from './components/driver-app/driver-alerts/driver-alerts.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'vendor-portal', component: VendorPortalComponent },
  { path: 'driver/login', component: DriverLoginComponent },
  { 
    path: 'driver', 
    component: DriverLayoutComponent,
    children: [
      { path: 'home', component: DriverHomeComponent },
      { path: 'live', component: DriverLiveComponent },
      { path: 'history', component: DriverHistoryComponent },
      { path: 'profile', component: DriverProfileComponent },
      { path: 'alerts', component: DriverAlertsComponent },
      { path: 'attendance', component: DriverAttendanceComponent },
      { path: 'manage/:token', component: DriverPortalComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
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
  { path: 'duty-types', component: DutyTypesComponent, canActivate: [AuthGuard] },
  { path: 'car-management', component: ExpensesComponent, canActivate: [AuthGuard] },
  
  // Wildcard Route
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
