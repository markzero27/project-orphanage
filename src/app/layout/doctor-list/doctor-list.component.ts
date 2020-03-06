import { Component, OnInit } from '@angular/core';
import { Doctor, initDoc } from 'src/app/models/doctor.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor/doctor.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  doctor: Doctor;
  doctorList: Doctor[] = [];
  closeResult: string;

  doc_name = '';
  schedules = '';
  specialization = '';
  order = 'asc';

  constructor(
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.setdoctors();
  }

  ngOnInit() {
  }

  close() {
    this.modalService.dismissAll();
  }

  setdoctors() {
    this.doctorService.getAllDoctors(0).subscribe(doctors => {
      this.doctorList = doctors;
      this.doctor = JSON.parse(JSON.stringify(initDoc));
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async addDoctor() {
    if (this.doctor.doc_name.trim() == '') {
      return this.toastr.error('Please enter doctor name!')
    }

    await this.doctorService.addDoctor(this.doctor).toPromise();
    this.setdoctors();
    this.close();
  }

  filter(value) {
    let doctors = this.doctorList;

    if (this.doc_name != '') {
      console.log('doc_name');

      doctors = doctors.filter(doctor => {
        if (this.doc_name == doctor.doc_name) {
          return true;
        }
        return false;
      });
    }

    if (this.schedules != '') {
      console.log('schedules');

      doctors = doctors.filter(doctor => {
        if (this.schedules == doctor.schedules) {
          return true;
        }
        return false;
      });
    }

    if (this.specialization != '') {
      console.log('specialization');

      doctors = doctors.filter(doctor => {
        if (this.specialization == doctor.specialization) {
          return true;
        }
        return false;
      });
    }

    console.log(doctors);

    this.doctorList = doctors;

  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.doctorList = this.doctorList.sort((a, b) => {
        if (a[column] > b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.order = 'desc';
      this.doctorList = this.doctorList.sort((a, b) => {
        if (a[column] < b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
    }

  }

}
