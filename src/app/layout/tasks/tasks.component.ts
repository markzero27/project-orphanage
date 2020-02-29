import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  time: any;
  taskList: Task[] = [];
  userId = localStorage.getItem('user_id');
  constructor(
    public router: Router,
    private userService: UsersService,
    private toastr: ToastrService,
    private taskService: TaskService,
    private modalService: NgbModal,
  ) {
    this.getAllTasks(this.userId);
  }

  ngOnInit() {
    this.setTime();
  }

  async getAllTasks(id) {
    this.taskList = await this.taskService.getTaskByStaff(id).toPromise() as Task[];
  }

  setTime() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

}
