import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders, initialElder } from 'src/app/models/elders.model';

@Component({
  selector: 'app-elders',
  templateUrl: './elders.component.html',
  styleUrls: ['./elders.component.scss']
})
export class EldersComponent implements OnInit {
  elderList: Elders[] = [];
  constructor(public router: Router, private elderService: EldersService) {
    this.elderService.getAllElders().subscribe((elders: Elders[]) => {
      this.elderList = elders;
    });
  }

  ngOnInit() {
  }

}
