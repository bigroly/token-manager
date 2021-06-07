import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AppToken } from 'src/app/models/token/appToken.model';
import { TokenService } from 'src/app/services/token.service';
import { UtilityService } from 'src/app/services/utility.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.scss']
})
export class AddTokenComponent implements OnInit {

  public addTokenForm: FormGroup;
  public tokenExpiry: number;

  constructor(public _activeModal: NgbActiveModal, private _utils: UtilityService, private _tokenService: TokenService, private _toastr: ToastrService) {
    this.tokenExpiry = + moment().utc().add(7, 'days').format('X');

    this.addTokenForm = new FormGroup({
      appName: new FormControl('', Validators.required),
      token: new FormControl({value: '', disabled: true}, Validators.required),
      expiry: new FormControl({ value: 0 })
    });

    this.addTokenForm.setValue({
      appName: '',
      token: uuidv4(),
      expiry: this.tokenExpiry
    });
  }

  ngOnInit(): void {
    
  }

  public async onSubmitAddTokenForm(): Promise<void>{
    const formVals = this.addTokenForm.getRawValue();
    const tokenToAdd: AppToken = {
      appName : formVals.appName,
      token: formVals.token,
      expiryUtc: formVals.expiry
    }

    try{
      const apiResponse = await this._tokenService.addEditToken(tokenToAdd);
      
      if(apiResponse.success){
        this._toastr.success('', 'Token Added');
        this._activeModal.close(tokenToAdd);
      }else{
        this._toastr.error('apiResponse.errorMessage', 'API Error while adding new token');
      }
    }
    catch(e){
      console.log(e);
      this._toastr.error('', 'Error adding new token');
    }  
    
  }

  public onCancelClick(): void{
    this._activeModal.dismiss(null);
  }

  public displayTokenExpiryAsString(tokenExp: number): string{
    return this._utils.utcEpochToLocalString(tokenExp);
  }

}
