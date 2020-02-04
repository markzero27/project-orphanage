import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = environment.api;
  userId = +localStorage.getItem('user_id');
  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.url + 'users');
  }
}
