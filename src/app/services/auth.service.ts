import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostLoginResponse } from '../contracts/auth/post.loginResponse.model';
import { PostLoginRequest } from '../contracts/auth/post.loginRequest.model';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { IdTokenProps } from '../models/auth/idTokenProps.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private idToken: string = '';
  public idTokenProps?: IdTokenProps;
  public amLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient, private _router: Router, private _toastr: ToastrService) {
    if(localStorage.getItem('idToken')){
      this.idToken = localStorage.getItem('idToken') ?? '';
      this.setIdTokenProps(this.idToken);      
    };
   }

  public async login(username: string, password: string): Promise<PostLoginResponse>{
    
    let request: PostLoginRequest = {
      username: username,
      password: password,
      clientId: environment.cognitoClientId
    }

    let response = await this._http.post<PostLoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, request).toPromise();    
    return response;
  }

  public logOut(): void{
    this.idToken  = '';
    this.idTokenProps = undefined;
    
    localStorage.removeItem('idToken');
    this.amLoggedIn.next(false);
  }

  public setIdTokenProps(token: string): void{
    
    let tokenDecoded: any = jwt_decode(token);
    
    this.idTokenProps = {
      userId: tokenDecoded['sub'],
      username : tokenDecoded['cognito:username'],
      cognitoGroups: tokenDecoded['cognito:groups'] ?? [],
      tokenExpiry: tokenDecoded['exp'],
    };

    this.idToken = token;
    localStorage.setItem('idToken', this.idToken);

    if(!this.tokenExpired()){
      this.amLoggedIn.next(true); 
    }
    else{
      this._toastr.error('Your access token has expired, please sign in again', 'Access Expired');
      this.logOut();
      this._router.navigateByUrl('login');   
    }
  }  

  public tokenExpired(): boolean {
    let tokenExp = moment.utc(moment.unix(this.idTokenProps? this.idTokenProps.tokenExpiry : 0));
    if(moment().utc().isAfter(tokenExp)){
      return true;
    }
    return false;
  }
  
  public generateAuthHeader(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.idToken
    });
  }
}
