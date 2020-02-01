import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  tab = 1;
  constructor() { }

  ngOnInit() {
  }

}
