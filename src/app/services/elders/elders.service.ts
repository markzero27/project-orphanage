import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Elders } from 'src/app/models/elders.model';

@Injectable({
  providedIn: 'root'
})
export class EldersService {
  url = environment.api + 'elders';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getAllElders() {
    return this.http.get(this.url, { headers: this.reqHeader });
  }

  addElder(data: Elders) {
    data.created_by = Number(this.userId);
    data.updated_by = Number(this.userId);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }
}
