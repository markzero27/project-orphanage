import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Elders, initialElder } from 'src/app/models/elders.model';
import { EldersService } from 'src/app/services/elders/elders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-elders-add-page',
  templateUrl: './elders-add-page.component.html',
  styleUrls: ['./elders-add-page.component.scss']
})
export class EldersAddPageComponent implements OnInit {
  elder: Elders = initialElder;
  bDate: any;
  dateIn: any;
  sabbath: any;

  constructor(public router: Router, private elderService: EldersService, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  addElder() {

    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.year}`;
      this.elder.birth_date = newDate;
    } else {
      return this.toastr.error('Please enter valid date!');
    }

    if (this.dateIn) {
      const newDate = `${this.dateIn.year}-${this.dateIn.month}-${this.dateIn.year}`;
      this.elder.date_stay_in_orphanage = newDate;
    } else {
      return this.toastr.error('Please enter valid date!');
    }

    if (this.sabbath) {
      const newDate = `${this.sabbath.year}-${this.sabbath.month}-${this.sabbath.year}`;
      this.elder.sabbath = newDate;
    } else {
      return this.toastr.error('Please enter valid date!');
    }

    this.elderService.addElder(this.elder).subscribe(data => {
      console.log(data);
      this.toastr.success('Success!');
      this.elder = null;
      this.elder = initialElder;
      this.clearAll();
    });


  }

  clearAll() {
    this.bDate = null;
    this.dateIn = null;
    this.sabbath = null;
    this.elder = {
      id: 0
      , first_name: '',
      middle_name: '',
      last_name: '',
      nickname: '',
      gender: 'male',
      image: 'assets/images/default.jpeg',
      nationality: '',
      age: 0
      , birth_place: '',
      provincial_address: '',
      birth_date: '',
      sabbath: '',
      civil_status: 5,
      date_stay_in_orphanage: '',
      bed_no: 0
      , cp_first_name: '',
      cp_middle_name: '',
      cp_surname: '',
      cp_contact_no: '',
      cp_relationship: '',
      cp_provincial_add: '',
      cp_work: '',
      oi_phil_health: '',
      oi_sss_id: '',
      oi_senior_citizen_id: '',
      oi_pagibig: '',
      created_by: 0,
      updated_by: 0

    }
  }
}
