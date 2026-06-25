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

  // For B2B Settlement
  selectedB2BAssign: any = null;
  b2bExtraCharge: number = 0;

  // For Transaction View & Print
  selectedViewTx: any = null;
  selectedPrintTx: any = null;

  // Pagination for transactions
  txPage = 1;
  txPageSize = 7;
  txTotalCount = 0;

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

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    this.currentTenantId = this.authService.currentUserValue?.tenantId || 0;
    this.loadMarketplaceBoard();
    this.loadMarketplaceOffers();
    this.loadMarketplaceAssignments();
    this.loadMarketplaceTransactions();
    this.loadFleet();
  }

  get borrowedAssignments() {
    return this.marketplaceAssignments.filter(a => a.tenantId === this.currentTenantId);
  }

  get providedAssignments() {
    return this.marketplaceAssignments.filter(a => a.providerCompanyId === this.currentTenantId);
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
      next: (data) => this.marketplaceAssignments = data.filter((a: any) => a.settlementStatus !== 'Settled' && a.settlementStatus !== 'Completed'),
      error: (err) => console.error(err)
    });
  }

  loadMarketplaceTransactions() {
    this.apiService.getMarketplaceTransactions(this.txPage, this.txPageSize).subscribe({
      next: (res) => {
        this.marketplaceTransactions = res.data;
        this.txTotalCount = res.totalCount;
      },
      error: (err) => console.error(err)
    });
  }

  nextTxPage() {
    if ((this.txPage * this.txPageSize) < this.txTotalCount) {
      this.txPage++;
      this.loadMarketplaceTransactions();
    }
  }

  prevTxPage() {
    if (this.txPage > 1) {
      this.txPage--;
      this.loadMarketplaceTransactions();
    }
  }

  get txTotalPages(): number {
    return Math.ceil(this.txTotalCount / this.txPageSize) || 1;
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

  openB2BBill(assign: any) {
    this.selectedB2BAssign = assign;
    this.b2bExtraCharge = 0;
  }

  closeB2BBill() {
    this.selectedB2BAssign = null;
    this.b2bExtraCharge = 0;
  }

  processB2BPayment() {
    if (!this.selectedB2BAssign) return;

    const totalPayable = (this.selectedB2BAssign.price || 0) + (this.b2bExtraCharge || 0);

    const newTx = {
      marketplaceAssignmentId: this.selectedB2BAssign.id,
      amount: totalPayable
    };

    this.apiService.createMarketplaceTransaction(newTx).subscribe({
      next: () => {
        this.successMsg = `B2B Payment of $${totalPayable} to ${this.selectedB2BAssign.providerCompanyName} has been processed successfully!`;
        this.loadMarketplaceTransactions();
        this.loadMarketplaceAssignments(); // Refresh assignment status
        this.closeB2BBill();
      },
      error: (err) => console.error(err)
    });
  }

  viewTransaction(tx: any) {
    this.selectedViewTx = tx;
  }

  closeViewTransaction() {
    this.selectedViewTx = null;
  }

  printTransactionBill(tx: any) {
    this.selectedPrintTx = tx;
  }

  closePrintBill() {
    this.selectedPrintTx = null;
  }

  triggerPrint() {
    window.print();
  }

  getSharedTxId(tx: any): string {
    if (tx.transactionType && tx.transactionType.includes('[')) {
      const match = tx.transactionType.match(/\[(.*?)\]/);
      return match ? match[1] : tx.id.toString();
    }
    return tx.id.toString();
  }

  getCleanTxType(tx: any): string {
    if (tx.transactionType && tx.transactionType.includes('[')) {
      return tx.transactionType.split(' [')[0];
    }
    return tx.transactionType;
  }
}
