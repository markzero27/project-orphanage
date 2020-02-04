import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { EldersComponent } from './elders/elders.component';
import { StaffComponent } from './staff/staff.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { ReportsComponent } from './reports/reports.component';
import { MedicineInventoryComponent } from './medicine-inventory/medicine-inventory.component';
import { GuessMonitoringComponent } from './guess-monitoring/guess-monitoring.component';
import { SystemUsersComponent } from './system-users/system-users.component';
import { ArchivesComponent } from './archives/archives.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { EldersDetailsComponent } from './elders-details/elders-details.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { HospitalDetailsComponent } from './hospital-details/hospital-details.component';
import { EldersAddPageComponent } from './elders-add-page/elders-add-page.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'main', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'dashboard', component: MainDashboardComponent },
            { path: 'elders', component: EldersComponent },
            { path: 'elders/add', component: EldersAddPageComponent },
            { path: 'elders/details', component: EldersDetailsComponent },
            { path: 'staff', component: StaffComponent },
            { path: 'staff/details', component: StaffDetailsComponent },
            { path: 'hospitals', component: HospitalsComponent },
            { path: 'hospitals/details', component: HospitalDetailsComponent },
            { path: 'doctor-list', component: DoctorListComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'medicine-inventory', component: MedicineInventoryComponent },
            { path: 'guess-monitoring', component: GuessMonitoringComponent },
            { path: 'archives', component: ArchivesComponent },
            { path: 'system-users', component: SystemUsersComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
