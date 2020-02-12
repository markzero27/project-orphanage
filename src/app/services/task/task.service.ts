import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  url = environment.api + '/tasks';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getTaskByStaff(id) {
    return this.http.get(`${this.url}?task_owner_id=${id}`, { headers: this.reqHeader });
  }

  addTask(data: Task) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }
}
