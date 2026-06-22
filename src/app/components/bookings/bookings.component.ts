import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { PreviewbillComponent } from '../previewbill/previewbill.component';

interface SummaryData {
  totalVehicles: number;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PreviewbillComponent],
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  // Signals for state management
  wizardStep = signal<number>(0);
  formState = signal<number>(0);
  isSubmitting = signal<boolean>(false);
  showBill = signal<boolean>(false);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');
  selectedBill: any = null;
  newCustomer: any = { name: '', email: '', phone: '', address: '' };
  
  // Data lists
  bookings: any[] = [];
  customers: any[] = [];
  cars: any[] = [];
  drivers: any[] = [];
  marketplaceCars: any[] = [];
  vendorCars: any[] = [];
  vendorDrivers: any[] = [];
  dependenciesLoaded = false;

  bookingForm!: FormGroup;

  // Computed summary
  summary = computed<SummaryData>(() => {
    this.formState(); // Register dependency
    let subtotal = 0;
    let totalVehicles = 0;
    
    if (this.bookingForm) {
      const vehicles = this.vehicles.getRawValue();
      totalVehicles = vehicles.length;
      subtotal = vehicles.reduce((sum: number, v: any) => sum + (Number(v.fare) || 0), 0);
    }
    
    const taxPercent = 15; // Example tax
    const taxAmount = (subtotal * taxPercent) / 100;
    const grandTotal = subtotal + taxAmount;

    return { totalVehicles, subtotal, taxPercent, taxAmount, grandTotal };
  });

  constructor(private fb: FormBuilder, private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.initForm();
    this.loadBookings();
  }

  initForm() {
    this.bookingForm = this.fb.group({
      customerId: ['', Validators.required],
      bookingType: ['Corporate', Validators.required],
      scheduledStart: ['', Validators.required],
      scheduledEnd: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      dropLocation: ['', Validators.required],
      notes: [''],
      vehicles: this.fb.array([])
    });

    // Subscribe to form changes to trigger signal updates for fare calculation
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateAllFares();
      this.formState.update(v => v + 1); // Trigger signal recomputation
    });
  }

  get vehicles(): FormArray {
    return this.bookingForm.get('vehicles') as FormArray;
  }

  addVehicle() {
    const vGroup = this.fb.group({
      carId: ['', Validators.required],
      driverId: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      pricingType: ['Fixed', Validators.required],
      
      // Fixed
      baseRate: [0],
      
      // Per KM
      ratePerKm: [0],
      distance: [0],
      
      // Hourly
      hourlyRate: [0],
      hours: [0],
      
      // Daily
      dailyRate: [0],
      days: [0],
      
      // Package
      packagePrice: [0],
      packageHours: [0],
      packageKm: [0],
      extraHourRate: [0],
      extraKmRate: [0],
      actualHours: [0],
      actualKm: [0],
      
      // Result
      fare: [{ value: 0, disabled: true }]
    });

    this.vehicles.push(vGroup);
  }

  removeVehicle(index: number) {
    this.vehicles.removeAt(index);
  }

  onCarChange(index: number) {
    const control = this.vehicles.at(index);
    const carId = control.get('carId')?.value;
    if (carId) {
      if (String(carId).startsWith('m_')) {
        const mId = Number(String(carId).replace('m_', ''));
        const mCar = this.marketplaceCars.find(m => m.id === mId);
        if (mCar) {
          if (mCar.driverName) {
            const driverId = mCar.driverId || -mId; // Fallback to negative ID if driverId is missing
            const driverExists = this.drivers.find(d => d.id === driverId);
            if (!driverExists) {
              this.drivers.push({
                id: driverId,
                firstName: mCar.driverName,
                lastName: '(Marketplace)'
              });
            }
            control.patchValue({ driverId: driverId });
          }
        }
      } else if (String(carId).startsWith('v_')) {
        const vId = Number(String(carId).replace('v_', ''));
        const vCar = this.vendorCars.find(v => v.id === vId);
        // Vendor cars usually have 0 base rate, user types in the package/fare manually.
        if (vCar) {
          control.patchValue({
             baseRate: 0,
             dailyRate: 0,
             hourlyRate: 0,
             ratePerKm: 0,
             packagePrice: 0
          });
        }
      } else {
        const selectedCar = this.cars.find(c => c.id === Number(carId));
        if (selectedCar && selectedCar.baseRate) {
          control.patchValue({
            baseRate: selectedCar.baseRate,
            dailyRate: selectedCar.baseRate,
            hourlyRate: selectedCar.baseRate,
            ratePerKm: selectedCar.baseRate,
            packagePrice: selectedCar.baseRate
          });
        }
      }
    }
  }

  calculateAllFares() {
    this.vehicles.controls.forEach((control) => {
      const v = control.getRawValue();
      let fare = 0;
      const qty = Number(v.quantity) || 1;

      switch (v.pricingType) {
        case 'Fixed':
          fare = (Number(v.baseRate) || 0) * qty;
          break;
        case 'Per KM':
          fare = (Number(v.ratePerKm) || 0) * (Number(v.distance) || 0) * qty;
          break;
        case 'Hourly':
          fare = (Number(v.hourlyRate) || 0) * (Number(v.hours) || 0) * qty;
          break;
        case 'Daily':
          fare = (Number(v.dailyRate) || 0) * (Number(v.days) || 0) * qty;
          break;
        case 'Package':
          const basePkg = Number(v.packagePrice) || 0;
          const actualHrs = Number(v.actualHours) || 0;
          const pkgHrs = Number(v.packageHours) || 0;
          const extraHrRate = Number(v.extraHourRate) || 0;
          const actualKm = Number(v.actualKm) || 0;
          const pkgKm = Number(v.packageKm) || 0;
          const extraKmRate = Number(v.extraKmRate) || 0;

          const extraHrsCharge = actualHrs > pkgHrs ? (actualHrs - pkgHrs) * extraHrRate : 0;
          const extraKmCharge = actualKm > pkgKm ? (actualKm - pkgKm) * extraKmRate : 0;
          
          fare = (basePkg + extraHrsCharge + extraKmCharge) * qty;
          break;
      }
      
      // Update if changed to avoid loop
      if (control.get('fare')?.value !== fare) {
        control.patchValue({ fare }, { emitEvent: false });
      }
    });
  }

  loadDependencies() {
    if (this.dependenciesLoaded) return;
    this.dependenciesLoaded = true;

    this.apiService.getCustomers().subscribe(data => this.customers = data);
    this.apiService.getCars().subscribe(data => this.cars = data.filter((c: any) => c.status === 'Available'));
    this.apiService.getDrivers().subscribe(data => this.drivers = data.filter((d: any) => d.status === 'Available'));
    const currentTenantId = this.authService.currentUserValue?.tenantId;
    this.apiService.getMarketplaceAssignments().subscribe(data => {
      // 1. Cars we received from others via marketplace
      this.marketplaceCars = data.filter((a: any) => 
        a.plateNumber !== 'Pending Allocation' && 
        a.tenantId === currentTenantId &&
        a.status !== 'Completed'
      );
      
      // 2. Cars we gave to others via marketplace (should be hidden from our own fleet)
      const providedCarIds = new Set(
        data.filter((a: any) => a.providerCompanyId === currentTenantId && a.carId)
            .map((a: any) => a.carId)
      );
      this.cars = this.cars.filter(c => !providedCarIds.has(c.id));

      this.filterBookedMarketplaceCars();
    });
    this.apiService.getAllVendorVehicles().subscribe(data => this.vendorCars = data.filter(v => !v.status || v.status === 'Available'));
    this.apiService.getAllVendorDrivers().subscribe(data => this.vendorDrivers = data);
  }

  loadBookings() {
    this.apiService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.filterBookedMarketplaceCars();
      },
      error: (err) => console.error(err)
    });
  }

  filterBookedMarketplaceCars() {
    if (this.marketplaceCars.length && this.bookings.length) {
      // Collect all marketplace car IDs that are in active/completed bookings
      const bookedIds = new Set<number>();
      this.bookings.forEach(b => {
        if (b.vehicles) {
          b.vehicles.forEach((v: any) => {
            if (v.assignmentType === 'Marketplace' && v.carId) {
              bookedIds.add(v.carId);
            }
          });
        }
      });
      // Filter out those that are already booked
      this.marketplaceCars = this.marketplaceCars.filter(m => !bookedIds.has(m.id));
    }
  }

  createCustomer() {
    this.apiService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.apiService.getCustomers().subscribe(data => this.customers = data);
        this.newCustomer = { name: '', email: '', phone: '', address: '' };
      },
      error: (err) => console.error(err)
    });
  }

  startWizard() {
    this.wizardStep.set(1);
    this.initForm();
    this.loadDependencies();
    this.addVehicle();
  }

  nextStep() {
    if (this.wizardStep() === 1) {
      const step1Valid = ['customerId', 'bookingType', 'scheduledStart', 'scheduledEnd', 'pickupLocation', 'dropLocation']
        .every(field => this.bookingForm.get(field)?.valid);
        
      if (!step1Valid) {
        this.errorMsg.set('Please fill all required fields in Step 1.');
        return;
      }
      
      const start = new Date(this.bookingForm.value.scheduledStart);
      const end = new Date(this.bookingForm.value.scheduledEnd);
      if (start >= end) {
        this.errorMsg.set('Start Date cannot be greater than End Date.');
        return;
      }
    }
    
    if (this.wizardStep() === 2 && this.vehicles.length === 0) {
      this.errorMsg.set('Please assign at least one vehicle.');
      return;
    }

    this.errorMsg.set('');
    this.wizardStep.update(s => s + 1);
  }

  prevStep() {
    this.wizardStep.update(s => s - 1);
  }

  submitBooking() {
    if (this.bookingForm.invalid) {
      this.errorMsg.set('Please correct errors before submitting.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.bookingForm.getRawValue();

    // Map to the existing backend format
    const payload = {
      customerId: Number(formVal.customerId),
      scheduledStart: formVal.scheduledStart,
      scheduledEnd: formVal.scheduledEnd,
      pickupLocation: formVal.pickupLocation,
      dropLocation: formVal.dropLocation,
      totalAmount: this.summary().grandTotal,
      notes: formVal.notes,
      vehicles: formVal.vehicles.map((v: any) => {
        const isMarketplace = v.carId && String(v.carId).startsWith('m_');
        const isVendor = v.carId && String(v.carId).startsWith('v_');
        const isVendorDriver = v.driverId && String(v.driverId).startsWith('vd_');
        
        let assignmentType = 'Own';
        if (isMarketplace) assignmentType = 'Marketplace';
        else if (isVendor) assignmentType = 'Vendor';

        const rawCarId = isMarketplace ? Number(String(v.carId).replace('m_', '')) : 
                         (isVendor ? null : (v.carId ? Number(v.carId) : null));
                         
        const rawDriverId = isVendorDriver ? null : (v.driverId ? Number(v.driverId) : null);

        // Find Partner ID from car or driver to pass for Vendor Payments
        let partnerId: number | null = null;
        let pVehicleId: number | null = null;
        let pDriverId: number | null = null;
        
        if (isVendor) {
           pVehicleId = Number(String(v.carId).replace('v_', ''));
           const vCar = this.vendorCars.find(vc => vc.id === pVehicleId);
           if (vCar) partnerId = vCar.partnerId;
        }
        if (isVendorDriver) {
           pDriverId = Number(String(v.driverId).replace('vd_', ''));
        }

        return {
          assignmentType: assignmentType,
          carId: rawCarId,
          driverId: rawDriverId,
          partnerId: partnerId,
          partnerVehicleId: pVehicleId,
          partnerDriverId: pDriverId,
          quantity: Number(v.quantity),
          rateType: v.pricingType.replace(' ', ''),
          baseRate: v.pricingType === 'Fixed' ? v.baseRate : v.pricingType === 'Package' ? v.packagePrice : (v.ratePerKm || v.hourlyRate || v.dailyRate || 0),
          distance: v.distance || v.actualKm || null,
          hours: v.hours || v.actualHours || v.days || null,
          fare: Number(v.fare)
        };
      })
    };

    this.apiService.createBooking(payload).subscribe({
      next: () => {
        this.successMsg.set('Corporate multi-vehicle booking created successfully!');
        this.wizardStep.set(0);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || err.error || 'Failed to submit booking.');
        this.isSubmitting.set(false);
      }
    });
  }

  startBooking(id: number) {
    this.apiService.startBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error(err)
    });
  }

  completeBooking(id: number) {
    this.apiService.completeBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error(err)
    });
  }

  generateBill(booking: any) {
    this.loadDependencies();
    this.selectedBill = booking;
    this.showBill.set(true);
  }

  closeBill() {
    this.showBill.set(false);
    this.selectedBill = null;
  }
}
