import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-alerts',
  templateUrl: './driver-alerts.component.html',
  styleUrls: ['./driver-alerts.component.scss']
})
export class DriverAlertsComponent implements OnInit {
  alerts = [
    {
      id: 1,
      title: 'New Trip Assigned!',
      message: 'You have been assigned a new trip from City Center to Tech Park.',
      time: new Date(Date.now() - 1000 * 60 * 5),
      type: 'info',
      read: false,
      icon: 'bi-bell-fill',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Vehicle Maintenance Due',
      message: 'Your assigned vehicle ABC-1234 is due for maintenance tomorrow.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'warning',
      read: true,
      icon: 'bi-exclamation-triangle-fill',
      color: 'warning'
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Your trip fare for Booking FLT-9876 has been settled.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'success',
      read: true,
      icon: 'bi-check-circle-fill',
      color: 'success'
    }
  ];

  constructor() {}

  ngOnInit() {}

  markAsRead(alert: any) {
    alert.read = true;
  }

  markAllAsRead() {
    this.alerts.forEach(a => a.read = true);
  }
}
