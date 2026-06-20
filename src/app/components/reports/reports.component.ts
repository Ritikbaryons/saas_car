import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  isDownloading = false;

  constructor(private apiService: ApiService) {}

  downloadReport(type: string) {
    this.isDownloading = true;
    this.apiService.downloadReport(type).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `${type}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Download report failed', err);
        this.isDownloading = false;
      }
    });
  }
}
