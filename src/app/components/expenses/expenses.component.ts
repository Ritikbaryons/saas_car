import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export interface Expense {
  id?: number;
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  carId: number | null;
  carName?: string;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  cars: any[] = [];
  showModal = false;
  editingId: number | null = null;
  searchQuery: string = '';

  categories = ['Fuel', 'Maintenance', 'Salary', 'Rent', 'Toll', 'Insurance', 'Other'];

  expenseForm: Expense = {
    category: 'Fuel',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    carId: null
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.apiService.getExpenses().subscribe(data => this.expenses = data);
    this.apiService.getCars().subscribe(data => this.cars = data);
  }

  get filteredExpenses() {
    if (!this.searchQuery) return this.expenses;
    const lower = this.searchQuery.toLowerCase();
    return this.expenses.filter(e => 
      e.category.toLowerCase().includes(lower) || 
      e.description.toLowerCase().includes(lower) ||
      (e.carName && e.carName.toLowerCase().includes(lower))
    );
  }

  openModal(expense?: Expense) {
    if (expense) {
      this.editingId = expense.id || null;
      this.expenseForm = { 
        ...expense, 
        expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0] 
      };
    } else {
      this.editingId = null;
      this.expenseForm = {
        category: 'Fuel',
        amount: 0,
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
        carId: null
      };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  saveExpense() {
    const payload = {
      ...this.expenseForm,
      expenseDate: new Date(this.expenseForm.expenseDate).toISOString()
    };

    if (this.editingId) {
      this.apiService.updateExpense(this.editingId, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadData();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.apiService.createExpense(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadData();
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.apiService.deleteExpense(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
