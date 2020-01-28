import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  animations: [routerTransition()]
})
export class MainDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
