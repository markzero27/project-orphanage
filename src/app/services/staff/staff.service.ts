import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Elders } from 'src/app/models/elders.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  url = environment.api + '/users';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getAllUsers() {
    return this.http.get(this.url, { headers: this.reqHeader });
  }

  addUser(data: User) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  deleteUser(id) {
    return new Promise(resolve => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      });
    });
  }
}
