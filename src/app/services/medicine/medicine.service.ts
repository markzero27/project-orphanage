import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  url = 'http://localhost:8000/api/';
  constructor(private http: HttpClient) { }

  getAllMecine() {
    return this.http.get(this.url + 'elders');
  }
}
