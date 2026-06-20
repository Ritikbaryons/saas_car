import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent implements OnInit {
  marketplaceRequests: any[] = [];
  marketplaceOffers: any[] = [];
  marketplaceAssignments: any[] = [];
  marketplaceTransactions: any[] = [];

  // For assignment
  ownCars: any[] = [];
  ownDrivers: any[] = [];
  selectedAssignmentId: number | null = null;
  assignData = { carId: '', driverId: '' };

  newMarketplaceRequest = {
    requiredQty: 1,
    vehicleTypeRequired: 'Sedan',
    scheduledStart: '',
    scheduledEnd: '',
    targetPrice: 100
  };

  newMarketplaceOffer = {
    marketplaceRequestId: null as number | null,
    offerPrice: 100,
    quantityOffered: 1
  };

  successMsg = '';
  currentTenantId = 0;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.currentTenantId = this.authService.currentUserValue?.tenantId || 0;
    this.loadMarketplaceBoard();
    this.loadMarketplaceOffers();
    this.loadMarketplaceAssignments();
    this.loadMarketplaceTransactions();
    this.loadFleet();
  }

  loadFleet() {
    this.apiService.getCars().subscribe(data => this.ownCars = data.filter((c: any) => c.status === 'Available'));
    this.apiService.getDrivers().subscribe(data => this.ownDrivers = data.filter((d: any) => d.status === 'Available'));
  }

  loadMarketplaceBoard() {
    this.apiService.getMarketplaceRequests().subscribe({
      next: (data) => this.marketplaceRequests = data,
      error: (err) => console.error(err)
    });
  }

  loadMarketplaceOffers() {
    this.apiService.getMarketplaceOffers().subscribe({
      next: (data) => this.marketplaceOffers = data,
      error: (err) => console.error(err)
    });
  }

  loadMarketplaceAssignments() {
    this.apiService.getMarketplaceAssignments().subscribe({
      next: (data) => this.marketplaceAssignments = data,
      error: (err) => console.error(err)
    });
  }

  loadMarketplaceTransactions() {
    this.apiService.getMarketplaceTransactions().subscribe({
      next: (data) => this.marketplaceTransactions = data,
      error: (err) => console.error(err)
    });
  }

  createMarketplaceRequest() {
    const payload = {
      ...this.newMarketplaceRequest,
      requiredQty: Number(this.newMarketplaceRequest.requiredQty),
      targetPrice: Number(this.newMarketplaceRequest.targetPrice)
    };
    
    this.apiService.createMarketplaceRequest(payload).subscribe({
      next: () => {
        this.successMsg = 'Shortfall request posted to C2C board successfully!';
        this.loadMarketplaceBoard();
        this.newMarketplaceRequest = {
          requiredQty: 1,
          vehicleTypeRequired: 'Sedan',
          scheduledStart: '',
          scheduledEnd: '',
          targetPrice: 100
        };
      },
      error: (err) => console.error(err)
    });
  }

  createMarketplaceOffer(requestId: number) {
    this.newMarketplaceOffer.marketplaceRequestId = requestId;
    const payload = {
      marketplaceRequestId: Number(this.newMarketplaceOffer.marketplaceRequestId),
      offerPrice: Number(this.newMarketplaceOffer.offerPrice),
      quantityOffered: Number(this.newMarketplaceOffer.quantityOffered)
    };

    this.apiService.createMarketplaceOffer(payload).subscribe({
      next: () => {
        this.loadMarketplaceOffers();
        this.newMarketplaceOffer = {
          marketplaceRequestId: null,
          offerPrice: 100,
          quantityOffered: 1
        };
      },
      error: (err) => console.error(err)
    });
  }

  acceptMarketplaceOffer(offerId: number) {
    if (confirm('Accept this offer? This will initiate the C2C vehicle sharing contract.')) {
      this.apiService.acceptMarketplaceOffer(offerId).subscribe({
        next: () => {
          this.loadMarketplaceBoard();
          this.loadMarketplaceOffers();
          this.loadMarketplaceAssignments();
          this.loadMarketplaceTransactions();
        },
        error: (err) => console.error(err)
      });
    }
  }

  openAssignModal(assignmentId: number) {
    this.selectedAssignmentId = assignmentId;
    this.assignData = { carId: '', driverId: '' };
  }

  submitAssignment() {
    if (!this.selectedAssignmentId) return;
    this.apiService.assignMarketplaceVehicle(this.selectedAssignmentId, {
      carId: Number(this.assignData.carId),
      driverId: Number(this.assignData.driverId)
    }).subscribe({
      next: () => {
        this.successMsg = 'Vehicle and driver assigned to partner successfully!';
        this.selectedAssignmentId = null;
        this.loadMarketplaceAssignments();
        this.loadFleet();
      },
      error: (err) => console.error(err)
    });
  }

  viewDetails(assign: any) {
    alert(`Marketplace Assignment Details:\n\nProvider Company: ${assign.providerCompanyName}\nAssigned Vehicle Plate: ${assign.plateNumber}\nDriver Name: ${assign.driverName}\nDriver Phone: ${assign.driverPhone}\nPrice Agreed: $${assign.price}`);
  }
}
