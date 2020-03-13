import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users/users.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  rawStaffList: User[] = [];
  staffList: User[] = [];
  alerts: Array<any> = [];
  printList = [];
  userId = 0;
  order = 'asc';

  name = '';
  email = '';
  role = '';
  date_hired = '';
  status = '';

  constructor(
    private staffService: StaffService,
    public router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.staffService.getAllUsers(0).subscribe((users: any) => {
      this.staffList = users;
      this.rawStaffList = users;
    });
  }

  async delete(content, userId) {
    this.userId = userId;
    await this.modalService.open(content, { size: 'sm' }).result;
  }

  async deleteStaff() {
    this.userService.deleteUser(this.userId).then(async () => {
      this.toastr.success('Record deleted!');
      this.staffList = await this.staffService.getAllUsers(0).toPromise() as User[];
      this.close();
    }).catch(err => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    });

  }

  close() {
    this.modalService.dismissAll();
  }

  getRole(role) {
    const text = role == 0 ? 'Admin' : role == 1 ? 'Medical Staff' : 'Staff';
    return text;
  }

  filter() {
    let staff = this.rawStaffList;

    if (this.name != '') {
      staff = staff.filter(stff => {
        const name = `${stff.first_name} ${stff.last_name}`;
        if (name.includes(this.name)) {
          return true;
        }
        return false;
      });
    }

    if (this.role != '') {
      staff = staff.filter(stff => {
        if (+this.role == stff.role) {
          return true;
        }
        return false;
      });
    }

    if (this.email != '') {
      staff = staff.filter(stff => {
        const email = `${stff.email}`;
        if (email.includes(this.email)) {
          return true;
        }
        return false;
      });
    }

    if (this.date_hired != '') {
      console.log('date');
      staff = staff.filter(stff => {
        const dateAff = new Date(this.date_hired).getTime();
        const stffAff = new Date(stff.date_hired).getTime();
        const date = `${stff.date_hired}`;
        if (date.includes(this.date_hired)) {
          return true;
        }
        return false;
      });
    }

    if (this.status != '') {
      staff = staff.filter(stff => {

        if (+this.status == stff.status) {
          return true;
        }
        return false;
      });
    }

    console.log(staff);

    this.staffList = staff;

  }

  sort(column) {

    if (this.order == 'desc') {

      this.order = 'asc';
      this.staffList = this.staffList.sort((a, b) => {
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
      this.staffList = this.staffList.sort((a, b) => {
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
    this.printList.push(['Name', 'User Role', 'Email', 'Date Hired', 'Status']);
    this.staffList.forEach(staff => {
      const staffPrintList = [];
      staffPrintList.push(staff['first_name'] + ' ' + staff['last_name']);
      staffPrintList.push(this.getRole(staff.role));
      staffPrintList.push(staff['email']);
      staffPrintList.push(staff['date_hired']);
      const statusValue = staff.status == 0 ? 'Inactive' : 'Active';
      staffPrintList.push(statusValue);
      
      this.printList.push(staffPrintList);
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
          text: 'Staff Report \n\n',
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
            widths: ['*', '*', '*', '*', '*'],
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
