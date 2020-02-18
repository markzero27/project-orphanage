import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Announcement } from 'src/app/models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  url = environment.api + '/announcements';
  api = environment.api + '/announcements';
  userId = +localStorage.getItem('user_id');
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) {
    console.log('====================================');
    console.log(this.userId);
    console.log('====================================');
  }


  getTakenMedicine(elder_id) {
    return this.http.get(`${environment.api}/elders-taken-medicine?elder_id=${elder_id}`, { headers: this.reqHeader });
  }

  addAnnouncement(data, report) {
    this.addAnnounceReport(report);
    return this.http.post(this.url, data, { headers: this.reqHeader });
  }

  addAnnounceReport(report) {
    this.http.post(`${environment.api}/announcement`, report).subscribe();
  }

  deleteMed(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.url}/${id}`, { headers: this.reqHeader }).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
}
