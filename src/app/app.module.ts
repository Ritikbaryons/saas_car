import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ApiInterceptor } from './core/interceptors/api.interceptor';

// Flow Module Components
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
import { PreviewbillComponent } from './components/previewbill/previewbill.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PlansComponent,
    TenantsComponent,
    FleetComponent,
    VendorsComponent,
    MarketplaceComponent,
    UsersRolesComponent,
    ReportsComponent,
    HeaderComponent,
    SidebarComponent,
    GeneralSettingsComponent,
    VendorPortalComponent,
    BookinghistoryComponent,
    DutyTypesComponent,
    ExpensesComponent,
    DriverPortalComponent,
    DriverLoginComponent,
    DriverLayoutComponent,
    DriverHomeComponent,
    DriverLiveComponent,
    DriverHistoryComponent,
    DriverAttendanceComponent,
    DriverProfileComponent,
    DriverAlertsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BookingsComponent,
    PreviewbillComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
