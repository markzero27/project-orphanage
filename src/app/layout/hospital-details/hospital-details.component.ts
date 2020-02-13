import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital, initHospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.scss']
})
export class HospitalDetailsComponent implements OnInit {
  editing = false;
  hospital: Hospital = JSON.parse(JSON.stringify(initHospital));
  constructor(private route: ActivatedRoute, private hospitalService: HospitalService) {
    this.route.params.subscribe(params => {
      this.hospitalService.getHospitalById(params.id).subscribe((hospital: any) => {
        this.hospital = hospital;
        console.log('====================================');
        console.log(hospital);
        console.log('====================================');
      });
    });
  }

  ngOnInit() {
  }

  save() {
    this.hospital.service_offer = ['asdas', 'asdasd', 'asdasds'];
    this.hospitalService.udpateHospital(this.hospital).subscribe();
    this.editing = false;
  }

}
