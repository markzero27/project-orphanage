import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';
import { Task } from 'src/app/models/task.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-dropdown',
  templateUrl: './task-dropdown.component.html',
  styleUrls: ['./task-dropdown.component.scss']
})
export class TaskDropdownComponent implements OnInit {
  @Input() task: Task;
  constructor(
    private taskService: TaskService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  updateTask(action) {
    this.task.status = action;
    this.taskService.updateTask(this.task).subscribe(() => {
      this.toastr.success('Status updated!');
    });
  }

}
