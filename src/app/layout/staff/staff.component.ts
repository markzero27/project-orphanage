import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  rawStaffList: User[] = [];
  staffList: User[] = [];
  alerts: Array<any> = [];
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
        if (this.email == stff.email) {
          return true;
        }
        return false;
      });
    }

    if (this.date_hired != '') {
      staff = staff.filter(stff => {
        const dateAff = new Date(this.date_hired).getTime();
        const stffAff = new Date(stff.date_hired).getTime();

        if (dateAff == stffAff) {
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
    console.log(column);

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

}
