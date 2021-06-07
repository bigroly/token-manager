import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GetListTokensResponse } from '../contracts/tokens/get.listTokensResponse.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private _http: HttpClient, private _authService: AuthService) {

  }

  public async listTokens(): Promise<GetListTokensResponse>{
    let response = await this._http.get<GetListTokensResponse>( `${environment.apiBaseUrl}/api/tokens`, { headers: this._authService.generateAuthHeader() }).toPromise();
    return response;
  }

}
