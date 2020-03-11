import { Component, OnInit } from '@angular/core';
import { AccomplishmentsService } from 'src/app/services/accomplishments/accomplishments.service';
import { Accomplishments, initAccomp } from 'src/app/models/accomplishments.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Task, TaskReport } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest } from 'src/app/models/guest.model';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { MedReport } from 'src/app/models/med-report.model';
import { TaskService } from 'src/app/services/task/task.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Userlogs } from 'src/app/models/use-logs.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  userData: User = JSON.parse(localStorage.getItem('user_data'));
  selectedType = 'daily';
  rawAccList: Accomplishments[] = [];
  accList: Accomplishments[] = [];
  medReports: MedReport[] = [];
  taskReports: TaskReport[] = [];
  rawTaskReportsList: TaskReport[] = [];
  taskReportsList: TaskReport[] = [];
  printList = [];
  printTaskList = [];
  time_in: any;
  time_out: any;
  closeResult: string;
  accomp: Accomplishments = JSON.parse(JSON.stringify(initAccomp));
  userLogs: Userlogs[] = [];

  guestList: Guest[] = [];

  order = 'asc';

  updated_at = '';
  submitted_by = '';
  problems_encountered = '';
  remarks = '';

  date = '';
  staff_name = '';
  elder_name = '';
  medicine_description = '';
  qty = '';
  created_at = '';
  status = '';
  

  constructor(
    private accompService: AccomplishmentsService,
    private modalService: NgbModal,
    private guestService: GuestService,
    private medService: MedicineService,
    private taskService: TaskService,
    private userService: UsersService,
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
    this.userService.getUserLogsById(this.userData.id).subscribe(logs => {
      this.userLogs = logs;
    });

    const today = new Date().toDateString();
    console.log(today);


    this.getTaskReports();
  }

  getAllAccmp() {
    this.accompService.getAllAccomplishments(0).subscribe(acc => {
      this.accList = acc.map(res => {
        res.submitted_by = JSON.parse(res.submitted_by);
        return res;
      });
      this.rawAccList = acc;
    });
  }

  getTaskReports() {
    if (this.userData.role != 0) {
      this.taskService.getTaskReportById(this.userData.id).subscribe(reports => {
        this.taskReports = reports;
      })
    } else {
      this.taskService.getTaskReports().subscribe(reports => {
        this.taskReports = reports;
      });
    }

  }

  ngOnInit() {
    this.taskService.getAllTasks(0).subscribe((report: TaskReport[]) => {
      this.rawTaskReportsList = report;
    });
  }

  addAccomplishment() {
    // if (!this.time_in || !this.time_out) {
    //   return this.toastr.error('Please enter valid time!');
    // }

    if (this.accomp.problems_encountered.trim() == '' || this.accomp.remarks.trim() == '') {
      return this.toastr.error('Please complete All fields!');
    }

    // this.accomp.time_in = `${this.time_in.hour}:${this.time_in.minute}`;
    // this.accomp.time_out = `${this.time_out.hour}:${this.time_out.minute}`;
    this.accomp.time_in = new Date().toLocaleDateString();
    this.accomp.time_out = new Date().toLocaleDateString();
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

  convertDate(date) {
    return new Date(date);
  }

  filter(value) {
    let accomp = this.rawAccList;
    let reports = this.rawTaskReportsList;

    if (this.updated_at != '') {
      console.log('updated_at');
      accomp = accomp.filter(acc => {
        const updated_at = `${acc.updated_at}`;
        if (updated_at.includes(this.updated_at)) {
          return true;
        }
        return false;
      });
    }

    if (this.submitted_by != '') {
      console.log('submitted_by');
      accomp = accomp.filter(acc => {
        const submitted_by = `${acc.submitted_by}`;
        if (submitted_by.includes(this.submitted_by)) {
          return true;
        }
        return false;
      });
    }

    if (this.problems_encountered != '') {
      console.log('problems_encountered');
      accomp = accomp.filter(acc => {
        const problems_encountered = `${acc.problems_encountered}`;
        if (problems_encountered.includes(this.problems_encountered)) {
          return true;
        }
        return false;
      });
    }

    if (this.remarks != '') {
      console.log(' remarks');
      accomp = accomp.filter(acc => {
        const remarks = `${acc.remarks}`;
        if (remarks.includes(this.remarks)) {
          return true;
        }
        return false;
      });
    }
    
    // if (this.time_in != '') {
    //   console.log('time_in');
    //   accomp = accomp.filter(acc => {
    //     const time_in = `${acc.time_in}`;
    //     if (time_in.includes(this.time_in)) {
    //       return true;
    //     }
    //     return false;
    //   });
    // }

    // if (this.time_out != '') {
    //   console.log('time_out');
    //   accomp = accomp.filter(acc => {
    //     const time_out = `${acc.time_out}`;
    //     if (time_out.includes(this.time_out)) {
    //       return true;
    //     }
    //     return false;
    //   });
    // }
    
    if (this.date != '') {
      console.log('date');
      reports = reports.filter(report => {
        const date = `${report.date}`;
        if (date.includes(this.date)) {
          return true;
        }
        return false;
      });
    }

    if (this.staff_name != '') {
      console.log('staff_name');
      reports = reports.filter(report => {
        const staff_name = `${report.staff_name}`;
        if (staff_name.includes(this.staff_name)) {
          return true;
        }
        return false;
      });
    }

    if (this.elder_name != '') {
      console.log('elder_name');
      reports = reports.filter(report => {
        const elder_name = `${report.elder_name}`;
        if (elder_name.includes(this.elder_name)) {
          return true;
        }
        return false;
      });
    }

    if (this.medicine_description != '') {
      console.log('medicine_description');
      reports = reports.filter(report => {
        const medicine_description = `${report.medicine_description}`;
        if (medicine_description.includes(this.medicine_description)) {
          return true;
        }
        return false;
      });
    }

    if (this.qty != '') {
      console.log('qty');
      reports = reports.filter(report => {
        const qty = `${report.qty}`;
        if (qty.includes(this.qty)) {
          return true;
        }
        return false;
      });
    }

    if (this.created_at != '') {
      console.log('created_at');
      reports = reports.filter(report => {
        const created_at = `${report.created_at}`;
        if (created_at.includes(this.created_at)) {
          return true;
        }
        return false;
      });
    }

    if (this.status != '') {
      console.log('status');
      reports = reports.filter(report => {
        const status = `${report.status}`;
        if (status.includes(this.status)) {
          return true;
        }
        return false;
      });
    }

    console.log(accomp);
    console.log(reports);

    this.accList = accomp;
    this.taskReportsList = reports;
  }

  sort(column) {
    console.log(column);

    if (this.order == 'desc') {

      this.order = 'asc';
      this.accList = this.accList.sort((a, b) => {
        if (a[column] > b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
      this.taskReportsList = this.taskReportsList.sort((a, b) => {
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
      this.accList = this.accList.sort((a, b) => {
        if (a[column] < b[column]) {
          return -1;
        }
        if (b[column] > a[column]) {
          return 1;
        }
        return 0;
      });
      this.taskReportsList = this.taskReportsList.sort((a, b) => {
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

  async exportPdf(){
    this.printList = [];
    this.printList.push(['Date','Created by', 'Problem Encountered', 'Remarks',  'Time_in', 'Time_out']);
    this.accList.forEach(acc => {
      const accPrintList = [];
      accPrintList.push(acc['updated_at']);
      accPrintList.push(acc['submitted_by']);
      accPrintList.push(acc['problems_encountered']);
      accPrintList.push(acc['remarks']);
      accPrintList.push(acc['time_in']);
      accPrintList.push(acc['time_out']);
      
      this.printList.push(accPrintList);
    });

    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
      var docDefinition = {
        content: [
          {
            table: {
              widths: ['*', '*', '*','*', '*', '*'],
              body: [ ... this.printList]
            }
          }
        ],
        styles: {
          font_8:{
              fontSize: 8,
              color: '#1B4E75'
          }
    }
      }

      pdfMake.createPdf(docDefinition).open();
  }

  async exportTaskPdf(){
    this.printTaskList = [];
    this.printTaskList.push(['Date','Assigned Staff', 'Elders Name', 'Medicine Description',  'Quantity', 'Time', 'Status']);
    this.taskReportsList.forEach(report => {
      const taskReportsPrintList = [];
      taskReportsPrintList.push(report['date']);
      taskReportsPrintList.push(report['staff_name']);
      taskReportsPrintList.push(report['elder_name']);
      taskReportsPrintList.push(report['medicine_description']);
      taskReportsPrintList.push(report['qty']);
      taskReportsPrintList.push(report['created_at']);
      taskReportsPrintList.push(report['status']);
      
      this.printList.push(taskReportsPrintList);
    });

    console.log(this.printTaskList);

    // playground requires you to assign document definition to a variable called dd
      var docTaskDefinition = {
        content: [
          {
            table: {
              widths: ['*', '*', '*','*', '*', '*', '* '],
              body: [ ... this.printTaskList]
            }
          }
        ],
        styles: {
          font_8:{
              fontSize: 8,
              color: '#1B4E75'
          }
    }
      }

      pdfMake.createPdf(docTaskDefinition).open();
  }

}