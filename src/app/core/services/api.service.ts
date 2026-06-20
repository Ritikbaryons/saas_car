import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Dashboard`);
  }

  // Vendors
  getVendors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors`);
  }

  getVendorSettlements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/settlements`);
  }

  createVendor(vendor: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors`, vendor);
  }

  getVendorVehicles(vendorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/${vendorId}/vehicles`);
  }

  getVendorDrivers(vendorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/${vendorId}/drivers`);
  }

  createVendorVehicle(vehicle: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors/vehicles`, vehicle);
  }

  createVendorDriver(driver: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors/drivers`, driver);
  }

  // Users, Roles & Permissions
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Users`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Users`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Users/${id}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Roles`);
  }

  createRole(role: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Roles`, role);
  }

  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Permissions`);
  }

  // Tenants
  getTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Tenants`);
  }

  deleteTenant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Tenants/${id}`);
  }

  // Plans
  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Plans`);
  }

  createPlan(plan: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Plans`, plan);
  }

  // Reports
  downloadReport(type: string): Observable<Blob> {
    return this.http.get(`${this.baseApiUrl}/Reports/export/${type}`, { responseType: 'blob' });
  }

  // Marketplace
  getMarketplaceRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Marketplace/requests`);
  }

  createMarketplaceRequest(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Marketplace/requests`, request);
  }

  getMarketplaceOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Marketplace/offers`);
  }

  createMarketplaceOffer(offer: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Marketplace/offers`, offer);
  }

  acceptMarketplaceOffer(offerId: number): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Marketplace/offers/${offerId}/accept`, {});
  }

  getMarketplaceAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Marketplace/assignments`);
  }

  assignMarketplaceVehicle(assignmentId: number, data: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/Marketplace/assignments/${assignmentId}/assign-vehicle`, data);
  }

  getMarketplaceTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Marketplace/transactions`);
  }

  // Fleet (Cars & Drivers)
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Cars`);
  }

  createCar(car: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Cars`, car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Cars/${id}`);
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Drivers`);
  }

  createDriver(driver: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Drivers`, driver);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Drivers/${id}`);
  }

  // Bookings
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Bookings`);
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Bookings`, booking);
  }

  startBooking(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Bookings/${id}/start`, {});
  }

  completeBooking(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Bookings/${id}/complete`, {});
  }

  // Customers
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Customers`);
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Customers`, customer);
  }
}
