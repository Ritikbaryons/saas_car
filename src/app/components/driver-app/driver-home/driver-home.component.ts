import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.scss']
})
export class DriverHomeComponent implements OnInit {
  data: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDriverHome().subscribe(res => {
      this.data = res;
    });
  }

}
