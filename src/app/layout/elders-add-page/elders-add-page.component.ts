import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Elders, initialElder, MedicalHistory, initalMedHistory } from 'src/app/models/elders.model';
import { EldersService } from 'src/app/services/elders/elders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-elders-add-page',
  templateUrl: './elders-add-page.component.html',
  styleUrls: ['./elders-add-page.component.scss']
})
export class EldersAddPageComponent implements OnInit {
  elder: Elders = JSON.parse(JSON.stringify(initialElder));
  medHistory: MedicalHistory = JSON.parse(JSON.stringify(initalMedHistory));
  bDate: any;
  dateIn: any;
  sabbath: any;

  constructor(public router: Router, private elderService: EldersService, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  addElder() {

    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.elder.birth_date = newDate;
    }

    if (this.dateIn) {
      const newDate = `${this.dateIn.year}-${this.dateIn.month}-${this.dateIn.day}`;
      this.elder.date_stay_in_orphanage = newDate;
    } else {
      return this.toastr.error('Please enter valid stay in date!');
    }

    if (this.sabbath) {
      const newDate = `${this.sabbath.year}-${this.sabbath.month}-${this.sabbath.day}`;
      this.elder.sabbath = newDate;
    }
    console.log('Elder to insert ====================================');
    console.log(this.elder);
    console.log('====================================');
    this.elderService.addElder(this.elder).subscribe((data: Elders) => {
      console.log(data);
      this.medHistory.elder_id = data.id;
      this.elderService.addMedicalHistory(this.medHistory).subscribe();
      this.toastr.success('Success!');
      this.clearAll();
      this.router.navigate(['/elders']);
    });


  }

  clearAll() {
    this.bDate = null;
    this.dateIn = null;
    this.sabbath = null;
    this.elder = JSON.parse(JSON.stringify(initialElder));
  }
}
