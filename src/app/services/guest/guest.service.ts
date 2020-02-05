import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Guest } from 'src/app/models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  url = environment.api + 'users';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' });
  constructor(private http: HttpClient) {
  }

  getAllGuests() {
    return this.http.get(this.url, { headers: this.reqHeader });
  }

  addGuest(data: Guest) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }
}
