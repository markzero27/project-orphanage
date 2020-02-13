import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EldersService } from 'src/app/services/elders/elders.service';
import { Elders, initialElder } from 'src/app/models/elders.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-elders',
  templateUrl: './elders.component.html',
  styleUrls: ['./elders.component.scss']
})
export class EldersComponent implements OnInit {
  elderList: Elders[] = [];
  userId = 0;
  constructor(
    public router: Router,
    private elderService: EldersService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.elderService.getAllElders('elders', 0).subscribe((elders: Elders[]) => {
      this.elderList = elders;
      console.log('====================================');
      console.log(elders);
      console.log('====================================');
    });
  }

  ngOnInit() {
  }

  async open(content, id) {
    this.userId = id;
    await this.modalService.open(content, { size: 'sm' }).result;
  }

  deleteElder() {
    this.elderService.deleteElder(this.userId).then(async () => {
      this.toastr.success('Record deleted!');
      this.elderList = await this.elderService.getAllElders('elders', 0).toPromise() as Elders[];
      this.close();
    }).catch(err => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    });

  }

  close() {
    this.modalService.dismissAll();
  }

}
