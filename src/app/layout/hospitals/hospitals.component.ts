import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital, initHospital } from 'src/app/models/hospital.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.scss']
})
export class HospitalsComponent implements OnInit {
  hospitalList: Hospital[] = [];
  hospital: Hospital;
  loading = true;
  closeResult: string;

  constructor(
    private hospitalService: HospitalService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.setHospitals();
  }

  setHospitals() {
    this.hospitalService.getAllHospitals(0).subscribe(hospitals => {
      this.hospitalList = hospitals;
      this.hospital = JSON.parse(JSON.stringify(initHospital));
    });
  }

  ngOnInit() {
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

  async addHospital() {
    if (this.hospital.hospital_name.trim() == '') {
      return this.toastr.error('Please enter hospital name!')
    }

    await this.hospitalService.addHospital(this.hospital).toPromise();
    this.setHospitals();
  }
}
