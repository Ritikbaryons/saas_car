import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService, UserSession } from '../../core/services/auth.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html'
})
export class PlansComponent implements OnInit {
  currentUser: UserSession | null = null;
  plans: any[] = [];
  newPlan = { name: '', description: '', price: 0, maxCars: 10, maxUsers: 3, enabledModules: [] as string[] };

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadPlans();
  }

  loadPlans() {
    this.apiService.getPlans().subscribe({
      next: (data) => this.plans = data,
      error: (err) => console.error('Failed to load plans', err)
    });
  }

  createPlan() {
    this.apiService.createPlan(this.newPlan).subscribe({
      next: () => {
        this.loadPlans();
        this.newPlan = { name: '', description: '', price: 0, maxCars: 10, maxUsers: 3, enabledModules: [] };
      },
      error: (err) => console.error('Failed to create plan', err)
    });
  }

  toggleModule(moduleName: string) {
    const index = this.newPlan.enabledModules.indexOf(moduleName);
    if (index > -1) {
      this.newPlan.enabledModules.splice(index, 1);
    } else {
      this.newPlan.enabledModules.push(moduleName);
    }
  }
}
