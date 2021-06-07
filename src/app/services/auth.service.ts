import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostLoginResponse } from '../contracts/auth/post.loginResponse.model';
import { PostLoginRequest } from '../contracts/auth/post.loginRequest.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _router: Router, private _toastr: ToastrService) { }

  public async login(username: string, password: string): Promise<PostLoginResponse>{
    
    let request: PostLoginRequest = {
      username: username,
      password: password,
      clientId: environment.cognitoClientId
    }

    let response = await this._http.post<PostLoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, request).toPromise();    
    return response;
  }
}
