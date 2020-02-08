import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { User, initialUser, EmpoymentHistory, initialEHistory } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  tab = 1;
  editing1 = false;
  editing2 = false;
  dateHired: any;
  bDate: any;
  sabbathDate: any;

  staff: User = JSON.parse(JSON.stringify((initialUser)));
  ehistory: any[];
  constructor(public route: ActivatedRoute, public router: Router, private userService: UsersService, private toastr: ToastrService) {
    this.route.params.subscribe(async params => {
      if (!params.id) {
        this.router.navigate(['/staff']);
      }

      this.staff = await this.userService.getStaff(params.id).toPromise() as User;
      this.ehistory = await this.userService.getEhistoryByStaffId(this.staff.id).toPromise() as EmpoymentHistory[];
      console.log('====================================');
      console.log(this.staff);
      console.log('====================================');
      this.initDates();
    });
  }

  ngOnInit() {
  }

  initDates() {
    if (this.staff.date_hired) {
      const dates = this.staff.date_hired.split('-');
      this.dateHired = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.staff.birth_date) {
      const dates = this.staff.birth_date.split('-');
      this.bDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.staff.sabbath) {
      const dates = this.staff.sabbath.split('-');
      this.sabbathDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
  }


  save() {
    this.editing1 = false;
    this.editing2 = false;
    console.log('====================================');
    console.log(this.dateHired);
    console.log('====================================');
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

    this.userService.udpateUser(this.staff, this.ehistory).then(() => {
      this.toastr.success('Saved!');
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

}
