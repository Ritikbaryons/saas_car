import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserSession } from './core/services/auth.service';
import { UiService } from './core/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Saas_Car_frontend';
  currentUser: UserSession | null = null;

  constructor(public authService: AuthService, private router: Router, public uiService: UiService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogout() {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  get isDriverApp(): boolean {
    return this.router.url.startsWith('/driver');
  }
}
