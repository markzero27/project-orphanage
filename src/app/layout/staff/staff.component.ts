import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff/staff.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  staffList: User[];
  constructor(private staffService: StaffService) { }

  ngOnInit() {
    this.staffService.getAllUsers().subscribe((users: any) => {
      this.staffList = users;
    });
  }

}
