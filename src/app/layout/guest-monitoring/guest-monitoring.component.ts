import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest/guest.service';
import { Guest, initialGuests } from 'src/app/models/guest.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders } from 'src/app/models/elders.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guess-monitoring',
  templateUrl: './guest-monitoring.component.html',
  styleUrls: ['./guest-monitoring.component.scss']
})
export class GuestMonitoringComponent implements OnInit {
  elderList: Elders[] = [];
  guestList: Guest[] = [];
  selectedElder = 1;
  selectedGuest: Guest = JSON.parse(JSON.stringify(initialGuests));;
  closeResult: string;
  alerts: Array<any> = [];
  time_in: any;
  time_in2: any;
  time_out: any;
  time_out2: any;
  deleteId = 0;

  guest: Guest = JSON.parse(JSON.stringify(initialGuests));

  constructor(
    private guestService: GuestService,
    private elderService: EldersService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.guestService.getAllGuests(0).subscribe((guests: Guest[]) => {
      this.guestList = guests;
    });

    this.elderService.getAllElders('elders', 0).subscribe((elders: any[]) => {
      this.elderList = elders;

      if (elders.length) {
        this.selectedElder = elders[0].id;
      }

    });
  }


  open(content) {
    if (this.elderList.length == 0) {
      return this.toastr.warning('No elder to visit. Please add Elder to visit first!');
    }

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
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


  addGuest() {

    if (this.guest.guest_name.trim() == '') {
      return this.addAlert('Please enter guest name!');
    }

    this.guest.time_in = new Date().toString();
    this.guest.elder_id = this.selectedElder;
    const elder = this.elderList.find(data => data.id == this.selectedElder);
    this.guest.elder_name = `${elder.first_name} ${elder.last_name}`;
    this.guestService.addGuest(this.guest).subscribe(async (res: any) => {
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest added!');
    });

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

  formatTime(timeString: string) {
    return new Date(timeString);
  }

  clearModalFields() {
    this.guest = JSON.parse(JSON.stringify(initialGuests));
    this.time_in = null;
    this.time_out = null;
  }

  setSelectedGuest(guest: Guest, content) {
    this.selectedGuest = JSON.parse(JSON.stringify(guest));
    if (guest.time_in) {
      this.time_in2 = {
        hour: +guest.time_in.substring(0, 1),
        minute: +guest.time_in.substring(3, 4)
      };
    }
    if (guest.time_out) {
      this.time_out2 = {
        hour: +guest.time_out.substring(0, 1),
        minute: +guest.time_out.substring(3, 4)
      };
    }
    this.selectedElder = this.selectedGuest.elder_id;
    this.open(content);
  }

  setGuestToDelete(id, content) {
    this.deleteId = id;
    this.openSm(content);
  }

  updateGuest() {
    this.selectedGuest.elder_id = this.selectedElder;
    const elder = this.elderList.find(data => data.id == this.selectedElder);
    this.selectedGuest.elder_name = `${elder.first_name} ${elder.last_name}`;

    this.guestService.updateGuest(this.selectedGuest).subscribe(async (res: any) => {
      const i = this.guestList.findIndex(x => x.id == res.id);
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest updated!');
    });

    this.clearModalFields();
    this.close();
  }

  async deleteGuest() {
    await this.guestService.deleteGuest(this.deleteId);
    this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
    this.toastr.success('Record deleted!');
    this.close();
  }

  timeOut(i) {
    this.guestList[i].time_out = new Date().toString();
    this.guestService.updateGuest(this.guestList[i]).subscribe(async (res: any) => {
      this.guestList = await this.guestService.getAllGuests(0).toPromise() as Guest[];
      this.toastr.success('Guest updated!');
    });
  }
}
