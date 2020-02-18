import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UsersService } from '../services/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    animations: [routerTransition()]
})
export class HelpComponent implements OnInit {
    email = '';
    password = '';
    constructor(
        public router: Router,
        private userService: UsersService,
        private toastr: ToastrService,
    ) {
        localStorage.setItem('isLoggedin', 'false');
    }

    ngOnInit() { }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
        if (this.email == 'admin' && this.password == 'admin') {
            localStorage.setItem('user_id', '0');
            localStorage.setItem('user_role', '0');
            this.router.navigate(['/dashboard']);
            this.toastr.success('Welcome Admin!');
        } else {
            this.userService.login({ email: this.email, password: this.password }).subscribe((res: any) => {
                if (res.data) {
                    localStorage.setItem('user_id', res.data.id);
                    localStorage.setItem('user_role', res.data.role);
                    localStorage.setItem('user_data', JSON.stringify(res.data));
                    this.router.navigate(['/dashboard']);
                    this.toastr.success(res.message);
                }
            }, get => {
                this.toastr.error(get.error.message);
            });
        }

    }
}
