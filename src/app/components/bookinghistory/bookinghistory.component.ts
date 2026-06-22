import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-bookinghistory',
  templateUrl: './bookinghistory.component.html',
  styleUrl: './bookinghistory.component.scss'
})
export class BookinghistoryComponent implements OnInit {
  bookings: any[] = [];
  totalCount: number = 0;
  
  // Pagination & Search
  page: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  
  isLoading: boolean = false;
  
  showBill: boolean = false;
  selectedBill: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.apiService.getBookingHistory(this.page, this.pageSize, this.searchQuery).subscribe({
      next: (res) => {
        this.bookings = res.data;
        this.totalCount = res.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.page = 1; // Reset to first page
    this.loadHistory();
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.totalCount) {
      this.page++;
      this.loadHistory();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadHistory();
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  generateBill(booking: any) {
    this.selectedBill = booking;
    this.showBill = true;
  }

  closeBill() {
    this.showBill = false;
    this.selectedBill = null;
  }
}
