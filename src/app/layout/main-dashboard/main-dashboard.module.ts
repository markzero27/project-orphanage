import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../bs-component/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule, NgbModule
  ]
})
export class MainDashboardModule { }
