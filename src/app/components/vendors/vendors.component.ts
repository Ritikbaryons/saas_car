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

  payPage = 1;
  payPageSize = 7;
  payTotalCount = 0;

  newVendor = {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: ''
  };

  newPayment = {
    partnerId: null as number | null,
    amount: null as number | null,
    paymentDate: new Date().toISOString().substring(0, 16),
    referenceNumber: '',
    notes: ''
  };

  showPaymentBill = false;
  selectedPaymentBill: any = null;
  showPaymentModal = false;

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
    this.loadVendorPayments();
  }

  loadVendors() {
    this.apiService.getVendors().subscribe({
      next: (data) => this.vendors = data,
      error: (err) => console.error(err)
    });
  }

  loadVendorPayments() {
    this.apiService.getVendorSettlements(this.payPage, this.payPageSize).subscribe({
      next: (res) => {
        this.vendorPayments = res.data;
        this.payTotalCount = res.totalCount;
      },
      error: (err) => console.error(err)
    });
  }

  nextPayPage() {
    if ((this.payPage * this.payPageSize) < this.payTotalCount) {
      this.payPage++;
      this.loadVendorPayments();
    }
  }

  prevPayPage() {
    if (this.payPage > 1) {
      this.payPage--;
      this.loadVendorPayments();
    }
  }

  get payTotalPages(): number {
    return Math.ceil(this.payTotalCount / this.payPageSize) || 1;
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

  getMagicLink(token: string): string {
    return `${window.location.origin}/vendor-portal?token=${token}`;
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard! Send this to your vendor partner.');
    });
  }

  sendLinkOnWhatsApp(v: any) {
    const link = this.getMagicLink(v.magicToken);
    const text = `Hi ${v.contactName},\n\nPlease update your vehicle availability on our portal:\n${link}`;
    // Strip non-numeric characters from phone number for wa.me
    const phone = v.phone ? v.phone.replace(/[^0-9]/g, '') : '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  openPaymentModal(vendor: any) {
    this.newPayment.partnerId = vendor.id;
    this.newPayment.amount = vendor.balance > 0 ? vendor.balance : 0;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  recordPayment() {
    if (!this.newPayment.partnerId || this.newPayment.amount == null) return;
    this.apiService.recordVendorPayment(this.newPayment).subscribe({
      next: () => {
        this.loadVendors();
        this.loadVendorPayments();
        this.newPayment = {
          partnerId: null,
          amount: null,
          paymentDate: new Date().toISOString().substring(0, 16),
          referenceNumber: '',
          notes: ''
        };
        this.showPaymentModal = false;
      },
      error: (err) => console.error(err)
    });
  }

  generateBill(payment: any) {
    this.selectedPaymentBill = payment;
    this.showPaymentBill = true;
  }

  closeBill() {
    this.showPaymentBill = false;
    this.selectedPaymentBill = null;
  }
}
