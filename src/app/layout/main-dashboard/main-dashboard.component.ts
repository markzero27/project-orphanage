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
import { Router } from '@angular/router';
import { NotesService } from 'src/app/services/notes/notes.service';
import { Notes } from 'src/app/models/notes.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  animations: [routerTransition()]
})

export class MainDashboardComponent implements OnInit {
  medicineList: Medicine[] = [];
  eventList: Event[] = [];
  notesList: Notes[] = [];
  notes = '';
  medName = '';
  quantity = 1;
  dateCreated: any;
  event = '';
  dateEvent: any;
  noteChecbox = false;
  // calendar variables
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { title: 'Today', start: new Date() }
  ];

  closeResult: string;
  alerts: Array<any> = [];
  dateSelected: EventInput;

  constructor(
    private modalService: NgbModal,
    private medicineService: MedicineService,
    public router: Router,
    private noteService: NotesService,
    private toastr: ToastrService
  ) {

    if (+localStorage.getItem('user_role') != 0) {
      this.router.navigate(['staff-dashboard']);
    }

    this.getAllNotes();
  }

  ngOnInit() {
  }

  getAllNotes() {
    this.noteService.getAllnotes().subscribe(notes => {
      this.notesList = notes.reverse();
    });
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

  addCalendarEvent() {
    if (!this.dateSelected.title || this.dateSelected.title.trim() == '') {
      return;
    }
    const event = {
      title: this.dateSelected.title,
      start: this.dateSelected.date,
      allDay: this.dateSelected.allDay
    };
    console.log('====================================');
    console.log(this.eventList);
    console.log('====================================');
    this.calendarEvents = this.calendarEvents.concat(event);

    this.close();
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
    this.medicineService.getAllMedicine(0).subscribe((list: Medicine[]) => {
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

  addNotes() {
    if (this.notes.trim() == '') {
      return;
    }

    const newNotes: Notes = {
      text: this.notes,
    };

    this.noteService.addnote(newNotes).subscribe(() => {
      this.getAllNotes();
      this.close();
      this.notes = '';
    });
  }

  selectAllNotes(value) {
    this.notesList.forEach(note => {
      note.isChecked = this.noteChecbox;
    });
  }

  deleteNotes() {
    if (this.notesList.some(note => note.isChecked)) {
      this.notesList.forEach(async note => {
        if (note.isChecked) {
          await this.noteService.deleteNote(note.id);
        }
      });
      this.toastr.success('Notes Deleted!');
      this.getAllNotes();

    } else {
      this.toastr.warning('No notes selected');
    }
  }

}
