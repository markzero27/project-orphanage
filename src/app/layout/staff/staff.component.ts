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
  staffList: User[] = [];
  alerts: Array<any> = [];
  userId = 0;
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

}
