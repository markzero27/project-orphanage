import { Component, OnInit } from '@angular/core';
import { Elders, initialElder, MedicalHistory, initalMedHistory } from 'src/app/models/elders.model';
import { Router, ActivatedRoute } from '@angular/router';
import { EldersService } from 'src/app/services/elders/elders.service';
import { ToastrService } from 'ngx-toastr';
import { MedicineService } from 'src/app/services/medicine/medicine.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-elders-details',
  templateUrl: './elders-details.component.html',
  styleUrls: ['./elders-details.component.scss']
})
export class EldersDetailsComponent implements OnInit {
  tab = 1;
  updating1 = false;
  updating2 = false;
  updating3 = false;
  updating4 = false;
  dateIn: any;
  bDate: any;
  sabbathDate: any;

  elder: Elders = JSON.parse(JSON.stringify(initialElder));
  medHistory: MedicalHistory[] = [];
  takenMeds = [];
  loading = true;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private elderService: EldersService,
    private medService: MedicineService,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,
    private userService: UsersService
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.elderService.getElderById(params.id).subscribe((elder: any) => {
          this.elder = elder;
          this.elderService.getMedHistoryById(elder.id).subscribe((res: any[]) => {
            this.medHistory = res;
            console.log(this.medHistory);
          });
          this.medService.getTakenMedicine(this.elder.id).subscribe((med: any[]) => {
            this.takenMeds = med;
          });
          this.initDates();
          this.loading = false;
        });
      } else {
        router.navigate(['/elders']);
      }
    });
  }

  ngOnInit() {
  }


  initDates() {
    if (this.elder.date_stay_in_orphanage) {
      const dates = this.elder.date_stay_in_orphanage.split('-');
      this.dateIn = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.elder.birth_date) {
      const dates = this.elder.birth_date.split('-');
      this.bDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
    if (this.elder.sabbath) {
      const dates = this.elder.sabbath.split('-');
      this.sabbathDate = {
        day: +dates[2],
        month: +dates[1],
        year: +dates[0]
      };
    }
  }


  async save() {
    this.updating1 = false;
    this.updating2 = false;
    if (this.bDate) {
      const newDate = `${this.bDate.year}-${this.bDate.month}-${this.bDate.day}`;
      this.elder.birth_date = newDate;
    }

    if (this.dateIn) {
      const newDate = `${this.dateIn.year}-${this.dateIn.month}-${this.dateIn.day}`;
      this.elder.date_stay_in_orphanage = newDate;
    } else {
      return this.toastr.error('Please enter valid date hired!');
    }

    if (this.sabbathDate) {
      const newDate = `${this.sabbathDate.year}-${this.sabbathDate.month}-${this.sabbathDate.day}`;
      this.elder.sabbath = newDate;
    }

    if (this.elder.first_name.trim() == '' || this.elder.last_name.trim() == '') {
      return this.toastr.error('Please fill up required fields');
    }

    if (this.fileData) {
      this.elder.image = await this.onSubmit() as string;
    }

    this.elderService.udpateElder(this.elder).subscribe(() => {
      this.toastr.success('Saved!');
    }, err => {
      this.toastr.error(err.message);
    });
  }

  saveMed() {
    this.updating3 = false;
    this.medHistory.forEach(med => {
      this.elderService.updateMedicalHistory(med).subscribe();
    });
    this.toastr.success('Saved!');
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  onSubmit() {
    return new Promise(resolve => {
      const formData = new FormData();
      console.log('====================================');
      console.log(this.fileData);
      console.log('====================================');
      formData.append('image', this.fileData);
      this.userService.uploadImage(formData).subscribe((res: any) => {
        console.log('====================================');
        console.log(res.filePath);
        console.log('====================================');
        resolve(`http://localhost:8000/storage/images/${res.filePath.substring(14)}`);
      });
    });

  }
}
