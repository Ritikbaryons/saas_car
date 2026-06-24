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
  getDashboard(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.baseApiUrl}/Dashboard`;
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return this.http.get<any>(url);
  }

  // Vendors
  getVendors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors`);
  }

  getVendorSettlements(page: number = 1, pageSize: number = 7): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Vendors/payments?page=${page}&pageSize=${pageSize}`);
  }

  recordVendorPayment(payment: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors/payments`, payment);
  }

  createVendor(vendor: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors`, vendor);
  }

  getVendorVehicles(vendorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/${vendorId}/vehicles`);
  }

  getAllVendorVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/vehicles/all`);
  }

  getVendorDrivers(vendorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/${vendorId}/drivers`);
  }

  getAllVendorDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Vendors/drivers/all`);
  }

  createVendorVehicle(vehicle: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Vendors/vehicles`, vehicle);
  }

  // --- Vendor Portal (Public Magic Link) ---
  getVendorByToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/VendorPortal/${token}`);
  }

  getVendorVehiclesByToken(token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/VendorPortal/${token}/vehicles`);
  }

  updateVendorVehicleStatus(token: string, vehicleId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/VendorPortal/${token}/vehicles/${vehicleId}/status`, { status });
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

  getMarketplaceTransactions(page: number = 1, pageSize: number = 7): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Marketplace/transactions?page=${page}&pageSize=${pageSize}`);
  }

  createMarketplaceTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Marketplace/transactions`, transaction);
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

  getBookingHistory(page: number = 1, pageSize: number = 10, search: string = ''): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Bookings/history?page=${page}&pageSize=${pageSize}&search=${search}`);
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Bookings`, booking);
  }

  startBooking(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Bookings/${id}/start`, {});
  }

  completeBooking(id: number, payload?: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/Bookings/${id}/complete`, payload || {});
  }

  // Customers
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/Customers`);
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Customers`, customer);
  }

  // Duty Types
  getDutyTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/DutyTypes`);
  }

  getDutyTypeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/DutyTypes/${id}`);
  }

  createDutyType(dutyType: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/DutyTypes`, dutyType);
  }

  updateDutyType(id: number, dutyType: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/DutyTypes/${id}`, dutyType);
  }

  deleteDutyType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/DutyTypes/${id}`);
  }

  // Expenses
  getExpenses(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Expenses`);
  }
  
  createExpense(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Expenses`, data);
  }
  
  updateExpense(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/Expenses/${id}`, data);
  }
  
  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/Expenses/${id}`);
  }

  // Driver Portal (Magic Link)
  getDriverTripDetails(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/DriverPortal/${token}`);
  }

  startDriverTrip(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/DriverPortal/${token}/start`, {});
  }

  // Driver App (Authenticated)
  getDriverHome(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/DriverApp/home`);
  }

  getDriverLiveRides(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/DriverApp/live`);
  }

  getDriverHistory(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/DriverApp/history`);
  }

  punchDriverAttendance(): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/DriverApp/attendance/punch`, {});
  }
}
