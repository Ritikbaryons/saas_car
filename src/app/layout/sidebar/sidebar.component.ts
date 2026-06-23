import { Component, OnInit } from '@angular/core';
import { AuthService, UserSession } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: UserSession | null = null;
  isMasterSetupOpen = false;
  isManagementOpen = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMasterSetup() {
    this.isMasterSetupOpen = !this.isMasterSetupOpen;
  }

  toggleManagement() {
    this.isManagementOpen = !this.isManagementOpen;
  }
}
