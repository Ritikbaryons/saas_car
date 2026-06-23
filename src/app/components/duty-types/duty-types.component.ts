import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export interface DutyType {
  id?: number;
  name: string;
  type: string;
  maxKilometers: number;
  maxHours: number;
  extraKmRate: number;
  extraHourRate: number;
}

@Component({
  selector: 'app-duty-types',
  templateUrl: './duty-types.component.html'
})
export class DutyTypesComponent implements OnInit {
  dutyTypes: DutyType[] = [];
  showModal = false;
  editingId: number | null = null;
  searchQuery: string = '';

  dutyTypeForm: DutyType = {
    name: '',
    type: 'HR-KM (Local)',
    maxKilometers: 0,
    maxHours: 0,
    extraKmRate: 0,
    extraHourRate: 0
  };

  types = ['HR-KM (Local)', 'Day-KM (Outstation)', 'Flat Rate'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDutyTypes();
  }

  loadDutyTypes() {
    this.apiService.getDutyTypes().subscribe({
      next: (data) => this.dutyTypes = data,
      error: (err) => console.error(err)
    });
  }

  get filteredDutyTypes() {
    return this.dutyTypes.filter(d => 
      d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openModal(dutyType?: DutyType) {
    if (dutyType) {
      this.editingId = dutyType.id!;
      this.dutyTypeForm = { ...dutyType };
    } else {
      this.editingId = null;
      this.dutyTypeForm = { name: '', type: 'HR-KM (Local)', maxKilometers: 0, maxHours: 0, extraKmRate: 0, extraHourRate: 0 };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDutyType() {
    if (this.editingId) {
      this.apiService.updateDutyType(this.editingId, this.dutyTypeForm).subscribe({
        next: () => {
          this.loadDutyTypes();
          this.closeModal();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.apiService.createDutyType(this.dutyTypeForm).subscribe({
        next: () => {
          this.loadDutyTypes();
          this.closeModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteDutyType(id: number) {
    if (confirm('Are you sure you want to delete this duty type?')) {
      this.apiService.deleteDutyType(id).subscribe({
        next: () => this.loadDutyTypes(),
        error: (err) => console.error(err)
      });
    }
  }
}
