import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-layout',
  templateUrl: './driver-layout.component.html',
  styleUrls: ['./driver-layout.component.scss']
})
export class DriverLayoutComponent {
  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
