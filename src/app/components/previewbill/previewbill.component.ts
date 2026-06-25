import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-previewbill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './previewbill.component.html'
})
export class PreviewbillComponent {
  @Input() selectedBill: any;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  copyMagicLink(token: string) {
    if (!token) return;
    const link = `${window.location.origin}/driver/manage/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Driver Portal Magic Link copied to clipboard!\n\n' + link);
    });
  }
}
