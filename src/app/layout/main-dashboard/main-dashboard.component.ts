import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { Medicine } from 'src/app/models/medicine.model';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  animations: [routerTransition()]
})
export class MainDashboardComponent implements OnInit {

  medicineList: Medicine[] = [];
  medName = '';
  quantity = 1;
  dateCreated: any;
  // calendar variables
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];

  closeResult: string;
  alerts: Array<any> = [];

  constructor(private modalService: NgbModal, private medicineService: MedicineService) { }

  ngOnInit() {
  }

  closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay
      });
    }
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

  async getAllMedicines() {
    this.medicineService.getAllMedicine().subscribe((list: Medicine[]) => {
      this.medicineList = list;
    });
  }

  addMedicine() {

    if (this.medName.trim() == '') {
      return this.addAlert('Please enter medicine name!');
    }

    if (this.quantity == 0 || this.quantity == null) {
      return this.addAlert('Please enter valid quantity!');
    }

    if (!this.dateCreated) {
      return this.addAlert('Please enter valid Date!');
    }

    this.clearModalFields();
    this.close();

  }

  addAlert(message) {
    const alert = {
      id: Math.random().toFixed(2),
      type: 'danger',
      message
    };
    this.alerts.push(alert);
    setTimeout(() => {
      this.alerts = this.alerts.filter(filter => filter.id != alert.id);
    }, 3000);
  }

  clearModalFields() {
    this.medName = '';
    this.dateCreated = '';
    this.quantity = 1;
  }

}
