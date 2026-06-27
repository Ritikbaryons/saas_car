import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private loadingCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private toastId = 0;

  constructor() { }

  showLoading() {
    this.loadingCount++;
    this.isLoadingSubject.next(this.loadingCount > 0);
  }

  hideLoading() {
    this.loadingCount--;
    if (this.loadingCount < 0) this.loadingCount = 0;
    this.isLoadingSubject.next(this.loadingCount > 0);
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {
    const id = this.toastId++;
    const currentToasts = this.toastsSubject.value;
    const newToast = { message, type, id };
    
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
