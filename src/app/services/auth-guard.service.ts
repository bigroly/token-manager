import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IdTokenProps } from '../models/auth/idTokenProps.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _router: Router, private _authService: AuthService, private _toastr: ToastrService) { 
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(state.url == '/' || state.url.indexOf('login') > 0 || state.url.indexOf('logout') > 0 || state.url.indexOf('forgotPassword') > 0 || state.url.indexOf('resetPassword') > 0){
      return true;
    }
    
    let token = this.retrieveToken();
    
    if(!token){      
      this._toastr.error( 'Please sign in to continue.' , 'Permissions error');
      this._router.navigate(['/login']);      
      return false;
    }
    
    if (!token.tokenExpiry) {      
      this._toastr.error( 'Your access token is invalid, please sign in again.' , 'Permissions error');
      this._router.navigate(['/login']);      
      return false;
    }
    
    if(state.url.indexOf('/login') < 0){
      if(token.tokenExpiry < Math.round(Date.now() / 1000)){
        this._toastr.error( 'Your access token has expired, please sign in again.' , 'Permissions error');
          this._router.navigate(['/login']);      
          return false;
      }
    }    
    
    if(this.checkUserPermissionsForRoute(next, token)){
      return true;
    }
    else{
      this._toastr.warning('You do not have permissions to access this component. Please contact an admin to amend your permission settings', 'Access denied');
      return false;
    }
  }

  private checkUserPermissionsForRoute(routeTo: ActivatedRouteSnapshot, userProps: IdTokenProps): boolean{
    
    if(routeTo.data.requiredGroups == null){
      return true;
    }

    for(let group of routeTo.data.requiredGroups){
      if(userProps.cognitoGroups.find(g => g.toLowerCase() == group.toLowerCase())){
        //user has permission for this component
        return true;
      }
    }

    return false;
  }

  private retrieveToken(): IdTokenProps | null {
    
    if(this._authService.idTokenProps && !this._authService.tokenExpired()){
      return this._authService.idTokenProps
    }
    
    if(localStorage.getItem('idToken') != null){
      return JSON.parse(localStorage.getItem('idToken') ?? '');
    }

    return null;
  }
}
