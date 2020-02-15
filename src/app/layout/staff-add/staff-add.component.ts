import { Component, OnInit } from '@angular/core';
import { User, initialUser, EmpoymentHistory, initialEHistory } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.scss']
})
export class StaffAddComponent implements OnInit {
  staff: User = JSON.parse(JSON.stringify(initialUser));
  ehistory: EmpoymentHistory = JSON.parse(JSON.stringify(initialEHistory));
  constructor(public router: Router, private toastr: ToastrService, private userService: UsersService) {
    this.staff.role = 2;
  }
  dateHired: any;
  bDate: any;
  sabbathDate: any;
  confirm = '';

  ngOnInit() { }

  addStaff() {

    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.staff.birth_date = newDate;
    }

    if (this.dateHired) {
      const newDate = `${this.dateHired.year}-${this.dateHired.month}-${this.dateHired.day}`;
      this.staff.date_hired = newDate;
    } else {
      return this.toastr.error('Please enter valid date hired!');
    }

    if (this.sabbathDate) {
      const newDate = `${this.sabbathDate.year}-${this.sabbathDate.month}-${this.sabbathDate.day}`;
      this.staff.sabbath = newDate;
    }

    if (this.staff.first_name.trim() == '' || this.staff.last_name.trim() == '' || this.staff.email.trim() == '') {
      return this.toastr.error('Please fillup required fields');
    }

    if (this.staff.email.trim() == '' || this.staff.password.trim() == '') {
      return this.toastr.error('Please complete username and password');
    } else {
      if (this.staff.password != this.confirm) {
        return this.toastr.error('Password did not match!');
      }
    }

    this.userService.addUser(this.staff).subscribe(async (data: any) => {
      console.log(data);
      this.ehistory.staff_id = data.id;
      console.log('Employment ====================================');
      console.log(this.ehistory);
      console.log('====================================');
      await this.userService.addEmpolymentHistory(this.ehistory).toPromise();
      this.toastr.success('Success!');
      this.router.navigate(['/staff']);
    }, err => {
      this.toastr.error('Save Failed!');
    });

  }

}
