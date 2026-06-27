import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss']
})
export class DriverHistoryComponent implements OnInit {
  history: any[] = [];
  activeTab: string = 'Upcoming';
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDriverHistory().subscribe({
      next: (res) => {
        this.history = res || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  get filteredHistory() {
    if (!this.history) return [];
    
    const todayStr = new Date().toISOString().split('T')[0];

    return this.history.filter(t => {
      if (this.activeTab === 'Today') {
        return t.date && t.date.startsWith(todayStr);
      }
      if (this.activeTab === 'Upcoming') return t.status === 'Upcoming' || t.status === 'Assigned';
      if (this.activeTab === 'Live') return t.status === 'InProgress' || t.status === 'Active';
      if (this.activeTab === 'Completed') return t.status === 'Completed';
      if (this.activeTab === 'Cancelled') return t.status === 'Cancelled';
      return true;
    });
  }
}
