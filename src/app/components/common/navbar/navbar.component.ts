import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public amLoggedIn: boolean = false;
  public isMenuCollapsed: boolean = false;

  constructor(private _router: Router, private _authService: AuthService, private _toastr: ToastrService) { 
    this._authService.amLoggedIn.subscribe(i => {
      this.amLoggedIn = i;
    });
  }

  ngOnInit(): void {
  }

  public onLogoutClick(){
    this._authService.logOut();
    this._toastr.success('','You have Logged Out');
    this._router.navigateByUrl('login');
  }

}
