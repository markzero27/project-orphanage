import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-elders-details',
  templateUrl: './elders-details.component.html',
  styleUrls: ['./elders-details.component.scss']
})
export class EldersDetailsComponent implements OnInit {
  tab = 1;
  updating1 = false;
  updating2 = false;
  updating3 = false;
  updating4 = false;

  constructor() { }

  ngOnInit() {
  }

}
