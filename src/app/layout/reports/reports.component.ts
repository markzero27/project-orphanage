import { Component, OnInit } from '@angular/core';
import { AccomplishmentsService } from 'src/app/services/accomplishments/accomplishments.service';
import { Accomplishments, initAccomp } from 'src/app/models/accomplishments.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest } from 'src/app/models/guest.model';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { MedReport } from 'src/app/models/med-report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  userData: User = JSON.parse(localStorage.getItem('user_data'));
  selectedType = 'daily';
  accList: Accomplishments[] = [];
  medReports: MedReport[] = [];
  time_in: any;
  time_out: any;
  closeResult: string;
  accomp: Accomplishments = JSON.parse(JSON.stringify(initAccomp));


  guestList: Guest[] = [];

  constructor(
    private accompService: AccomplishmentsService,
    private modalService: NgbModal,
    private guestService: GuestService,
    private medService: MedicineService,
    private toastr: ToastrService) {
    this.getAllAccmp();
    this.guestService.getAllGuests(0).subscribe((guests: Guest[]) => {
      this.guestList = guests;
    });
    this.medService.getMedicineReports(0).subscribe(reports => {
      this.medReports = reports.map(report => {
        report.staff = JSON.parse(report.staff);
        return report;
      });
    });
  }

  getAllAccmp() {
    this.accompService.getAllAccomplishments(0).subscribe(acc => {
      this.accList = acc.map(res => {
        res.submitted_by = JSON.parse(res.submitted_by);
        return res;
      });
    });
  }

  ngOnInit() {
  }

  addAccomplishment() {
    if (!this.time_in || !this.time_out) {
      return this.toastr.error('Please enter valid time!');
    }

    if (this.accomp.task_description.trim() == '') {
      return this.toastr.error('Please enter task description!');
    }

    this.accomp.time_in = `${this.time_in.hour}:${this.time_in.minute}`;
    this.accomp.time_out = `${this.time_out.hour}:${this.time_out.minute}`;
    this.accomp.submitted_by = [this.userData.id, `${this.userData.first_name} ${this.userData.last_name}`];
    this.accompService.addAccomplishments(this.accomp).subscribe(res => {
      this.toastr.success('Successfuly added!');
      this.getAllAccmp();
      this.close();
      this.clearModalFields();
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close() {
    this.modalService.dismissAll();
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

  formatTime(timeString: string) {
    const today = new Date();

    today.setHours(+timeString.substring(0, 1));
    today.setMinutes(+timeString.substring(3, 4));
    return today;
  }

  clearModalFields() {
    this.accomp = JSON.parse(JSON.stringify(initAccomp));
    this.time_in = null;
    this.time_out = null;
  }

}
