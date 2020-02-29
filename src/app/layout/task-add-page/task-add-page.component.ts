import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task/task.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User, EmpoymentHistory, initialUser } from 'src/app/models/user.model';
import { Elders } from 'src/app/models/elders.model';
import { Medicine } from 'src/app/models/medicine.model';
import { Task } from 'src/app/models/task.model';
import { UsersService } from 'src/app/services/users/users.service';
import { EldersService } from 'src/app/services/elders/elders.service';
import { MedicineService } from 'src/app/services/medicine/medicine.service';

@Component({
  selector: 'app-task-add-page',
  templateUrl: './task-add-page.component.html',
  styleUrls: ['./task-add-page.component.scss']
})
export class TaskAddPageComponent implements OnInit {
  staff: User = JSON.parse(JSON.stringify((initialUser)));
  elderList: Elders[] = [];
  medList: Medicine[] = [];
  closeResult: string;
  time: any;
  addDate: any;
  elderIndex = 0;
  medIndex = 0;
  quantity = 0;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private taskService: TaskService,
    private modalService: NgbModal,
    private userService: UsersService,
    private elderService: EldersService,
    private medService: MedicineService,
  ) {
    this.route.params.subscribe(async params => {
      if (!params.id) {
        this.router.navigate(['/staff']);
      }
      this.staff = await this.userService.getStaff(params.id).toPromise() as User;
      this.elderList = await this.elderService.getAllElders('elders', 0).toPromise() as Elders[];
      this.medList = await this.medService.getAllMedicine(0).toPromise() as Medicine[];
    });
  }

  ngOnInit() {
  }

  async addTask() {
    if (!this.time) {
      return this.toastr.error('Please enter valid time!');
    }
    if (!this.addDate) {
      return this.toastr.error('Please enter valid date!');
    }

    if (this.quantity <= 0) {
      return this.toastr.error('Please enter valid quantity!');
    }

    const newTask: Task = {
      elder_id: this.elderList[this.elderIndex].id,
      elder_name: `${this.elderList[this.elderIndex].first_name} ${this.elderList[this.elderIndex].last_name}`,
      time: `${this.time.hour}:${this.time.minute}`,
      medicine_id: this.medList[this.medIndex].id,
      medicine_description: this.medList[this.medIndex].medicine_name,
      qty: this.quantity,
      task_owner_id: this.staff.id,
      task_description: `${this.staff.first_name} ${this.staff.first_name}`,
      status: 'Pending',
      date: `${this.addDate.year}-${this.addDate.month}-${this.addDate.day}`
    };

    this.taskService.addTask(newTask).toPromise().then(res => {
      this.toastr.success('Saved!');
      this.getAllTasks();
      this.close();
    }).catch(err => {
      this.toastr.error(err.message);
      this.close();
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

  close() {
    this.modalService.dismissAll();
  }


}
