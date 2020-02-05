import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest } from 'src/app/models/guest.model';

@Component({
  selector: 'app-guess-monitoring',
  templateUrl: './guest-monitoring.component.html',
  styleUrls: ['./guest-monitoring.component.scss']
})
export class GuestMonitoringComponent implements OnInit {
  guestList: Guest[] = [];
  constructor(private guestService: GuestService) { }

  ngOnInit() {
    this.guestService.getAllGuests().subscribe((guests: Guest[]) => {
      this.guestList = guests;
      console.log(this.guestList);
    });
  }

}
