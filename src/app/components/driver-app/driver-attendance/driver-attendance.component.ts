import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-attendance',
  templateUrl: './driver-attendance.component.html',
  styleUrls: ['./driver-attendance.component.scss']
})
export class DriverAttendanceComponent implements OnInit {
  today = new Date();
  loading = false;
  isCheckedIn = false;
  isCheckedOut = false;
  message = '';
  attendanceHistory: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStatus();
    this.loadHistory();
  }

  loadStatus() {
    this.api.getDriverHome().subscribe(res => {
      this.isCheckedIn = res?.isOnDuty || res?.isCheckedIn;
      this.isCheckedOut = res?.isCheckedOut;
    });
  }

  loadHistory() {
    this.api.getDriverAttendanceHistory().subscribe(res => {
      this.attendanceHistory = res;
    });
  }

  punchAttendance() {
    this.loading = true;
    this.message = '';
    this.api.punchDriverAttendance().subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message;
        this.loadStatus();
        this.loadHistory();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error || 'Failed to punch attendance');
      }
    });
  }

  get todayRecord() {
    if (!this.attendanceHistory || !this.attendanceHistory.records || this.attendanceHistory.records.length === 0) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    return this.attendanceHistory.records.find((r: any) => r.date.startsWith(todayStr)) || this.attendanceHistory.records[0];
  }

  formatTime(timeStr: string) {
    if (!timeStr) return '--:--';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const mins = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      return `${hours}:${mins} ${ampm}`;
    }
    return timeStr;
  }
}
