import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from 'src/app/services/task/task.service';
import { Task, TaskReport } from 'src/app/models/task.model';
import { ToastrService } from 'ngx-toastr';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { Medicine } from 'src/app/models/medicine.model';
import { MedReport } from 'src/app/models/med-report.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-task-dropdown',
  templateUrl: './task-dropdown.component.html',
  styleUrls: ['./task-dropdown.component.scss']
})
export class TaskDropdownComponent implements OnInit {
  @Input() task: Task;
  userData: User = JSON.parse(localStorage.getItem('user_data'));
  med: Medicine;
  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private medService: MedicineService
  ) { }

  ngOnInit() {
    console.log(this.task);
    this.medService.getMedicine(this.task.medicine_id).subscribe(med => {
      this.med = med[0];
      console.log('====================================');
      console.log(this.med);
      console.log('====================================');
    });
  }

  updateTask(action) {
    this.task.status = action;
    // this.taskService.updateTask(this.task).subscribe(() => {
    //   this.toastr.success('Status updated!');
    // });

    if (this.med.qty > 0 && this.med.qty > this.task.qty) {
      this.med.qty = this.med.qty - this.task.qty;
    } else {
      this.med.buffer = this.med.buffer - this.task.qty;
    }

    this.med.dispense = this.med.dispense + this.task.qty;

    const medReport: MedReport = {
      action: 'dispense',
      created_by: this.task.task_owner_id,
      medicine_name: this.med.medicine_name,
      medicine_type: this.med.type_of_medicine_description,
      quantity: this.task.qty,
      remaining_stock: this.med.qty,
      staff: [this.task.task_owner_id, `${this.userData.first_name} ${this.userData.last_name}`],
      updated_by: this.userData.id,
    };
    console.log(this.med);
    const taskReport: TaskReport = {
      date: new Date().toString(),
      elder_id: this.task.elder_id,
      elder_name: this.task.elder_name,
      medicine_description: this.task.medicine_description,
      medicine_id: this.task.medicine_id,
      staff_id: this.task.task_owner_id,
      staff_name: `${this.userData.first_name} ${this.userData.last_name}`,
      qty: this.task.qty,
      status: action,
      task_description: this.task.task_description,
      time: this.task.time,
    };
    this.taskService.addTaskReport(taskReport).subscribe();
    this.medService.updateMed(this.med, medReport).subscribe(med => {
      this.toastr.success('Status updated!');
    });
  }

}
