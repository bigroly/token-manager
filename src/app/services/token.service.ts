import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GetListTokensResponse } from '../contracts/tokens/get.listTokensResponse.model';
import { PostAddUpdateTokenRequest } from '../contracts/tokens/post.addUpdateTokenRequest.model';
import { PostAddUpdateTokenResponse } from '../contracts/tokens/post.addUpdateTokenResponse.model';
import { AppToken } from '../models/token/appToken.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private _http: HttpClient, private _authService: AuthService) {

  }

  public async listTokens(): Promise<GetListTokensResponse>{
    const response = await this._http.get<GetListTokensResponse>( `${environment.apiBaseUrl}/api/tokens`, { headers: this._authService.generateAuthHeader() }).toPromise();
    return response;
  }

  public async addEditToken(record: AppToken): Promise<PostAddUpdateTokenResponse>{
    const request: PostAddUpdateTokenRequest = {
      token: record
    }
    let response = await this._http.post<PostAddUpdateTokenResponse>(`${environment.apiBaseUrl}/api/tokens`, request, { headers: this._authService.generateAuthHeader() }).toPromise();    
    return response;
  }

}
