import { Component, OnInit } from '@angular/core';
import { Doctor, initDoc } from 'src/app/models/doctor.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  userRole = localStorage.getItem('user_role');
  doctor: Doctor;
  printList = [];
  doctorList: Doctor[] = [];
  closeResult: string;
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


  async exportPdf(){
    this.printList = [];
    this.printList.push(['Name','Contact Number', 'Schedules', 'Specialization',  'Date Updated']);
    this.doctorList.forEach(hospital => {
      const hospitalPrintList = [];
      hospitalPrintList.push(hospital['doc_name']);
      hospitalPrintList.push(hospital['contact_no']);
      hospitalPrintList.push(hospital['schedules']);
      hospitalPrintList.push(hospital['specialization']);
      hospitalPrintList.push(hospital['updated_at']);
      
      this.printList.push(hospitalPrintList);
    });

    console.log(this.printList);

    // playground requires you to assign document definition to a variable called dd
    var docDefinition = {
      content: [
        {
          text: 'ORPHANAGE',
          style: 'header',
          alignment: 'left',
          fontSize: 12,
          bold: true
        },
        {
          text: '888-B sabak street, baranggay san Antonio, San pedro City, Laguna \n\n\n',
          alignment: 'left',
          fontSize: 12
        },
        {
          text: 'Doctors Report \n\n',
          style: 'header',
          alignment: 'center',
          fontSize: 14,
          bold: true
        },
        {
          alignment: 'center',
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            body: [
              ['Submitted By: Anna Kendrick','Date Coverage: January 1,2020 - February 1,2020'],
              ['Printed by: Juan Dela Cruz' , 'Date Printed: January 2, 2020']
            ]
          }
        },
        {
          text: ' \n\n',
          style: 'header',
          alignment: 'center',
          fontSize: 14,
          bold: true
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [ ... this.printList]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              if(rowIndex == 0){
                return '#2d7dac';
              }else if(rowIndex % 2 === 0){
                return '#CCCCCC';
              } else { return null; }
            }
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
}
