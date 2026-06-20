import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

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
    GeneralSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BookingsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
