import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';



@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.scss']
})
export class DriverHomeComponent implements OnInit {
  data: any;
  showExpenseModal = false;
  
  newExpense = {
    date: new Date().toISOString().split('T')[0],
    category: 'Fuel',
    amount: 0,
    carId: null,
    description: ''
  };

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getDriverHome().subscribe(res => {
      this.data = res;
    });
  }
  
  openExpenseModal() {
    this.showExpenseModal = true;
  }

  closeExpenseModal() {
    this.showExpenseModal = false;
  }

  submitExpense() {
    if (!this.newExpense.amount || this.newExpense.amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    // Simulate API call for saving expense
    console.log('Expense Saved:', this.newExpense);
    alert('Expense recorded successfully!');
    
    // Reset form
    this.newExpense = {
      date: new Date().toISOString().split('T')[0],
      category: 'Fuel',
      amount: 0,
      carId: null,
      description: ''
    };
    
    this.closeExpenseModal();
  }
}
