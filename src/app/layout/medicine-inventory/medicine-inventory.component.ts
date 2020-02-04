import { Component, OnInit } from '@angular/core';
import { Medicine } from 'src/app/models/medicine.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MedicineService } from 'src/app/services/medicine/medicine.service';

@Component({
  selector: 'app-medicine-inventory',
  templateUrl: './medicine-inventory.component.html',
  styleUrls: ['./medicine-inventory.component.scss']
})
export class MedicineInventoryComponent implements OnInit {
  medicineList: Medicine[] = [];
  medName = '';
  quantity = 1;
  dateCreated: any;
  alerts: Array<any> = [];
  closeResult: string;

  constructor(private modalService: NgbModal, private medicineService: MedicineService) { }

  ngOnInit() {
  }

  closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
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
    this.medicineService.getAllMecine().subscribe((list: Medicine[]) => {
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
