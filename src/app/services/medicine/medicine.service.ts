import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  url = environment.api + 'medicine';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }

  getAllMecine() {
    return this.http.get(this.url, { headers: this.reqHeader });
  }

  addMedicine(data) {
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }
}
