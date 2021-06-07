import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AppToken } from 'src/app/models/token/appToken.model';
import { TokenService } from 'src/app/services/token.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddTokenComponent } from '../add-token/add-token.component';
import {Clipboard} from "@angular/cdk/clipboard"
import * as moment from 'moment';

@Component({
  selector: 'app-list-tokens',
  templateUrl: './list-tokens.component.html',
  styleUrls: ['./list-tokens.component.scss']
})
export class ListTokensComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};
  public tokens: AppToken[] = [];

  @ViewChild(DataTableDirective, {static: false})
  public dtElement: DataTableDirective | undefined;
  public dtTrigger: Subject<any> = new Subject<any>();

  constructor(private _tokenService: TokenService, private _toastr: ToastrService, private _modalService: NgbModal, private _utils: UtilityService, private _clipboard: Clipboard) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.getData();
  }

  private async getData(): Promise<void> { 
    try {
      const getTokensResp = await this._tokenService.listTokens();
      if (getTokensResp.success) {
        this.tokens = getTokensResp.tokens;
        this.rerenderTable();
      }
      else {
        this._toastr.error('', 'Server error obtaining Token Information');
      }
    }
    catch (e) {
      console.log(e);
      this._toastr.error('', 'Error obtaining Token Data');
    }

  }

  public displayLocalTokenDateTime(expiryUtc: number): string {
    return this._utils.utcEpochToLocalString(expiryUtc);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public onAddTokenClick(): void {
    const modalRef = this._modalService.open(AddTokenComponent, { size: 'xl', backdrop: 'static' });

    modalRef.closed.subscribe(newToken => {
      if (newToken != null) {
        this.getData();
      }
    })
  }

  public onCopyTokenClick(token: AppToken): void{
    const tokenToCopy: any = {
      apiToken: token
    }
    this._clipboard.copy(JSON.stringify(tokenToCopy));
    this._toastr.success('','Token copied to Clipboard');
  }

  public async onDeleteTokenClick(token: AppToken): Promise<void> {
    const confirmation = window.confirm(`Are you sure you want to delete the token for ${token.appName}?`);

    if (confirmation) {
      try {
        const deleteresp = await this._tokenService.deleteToken(token)
        if (deleteresp.success) {
          this._toastr.success('', 'Token deleted');
          this.getData();
        }
        else{
          this._toastr.error(deleteresp.errorMessage, 'API Error deleting token');
        }
      }
      catch(e){
        console.log(e);
        this._toastr.error('', 'Error deleting token');
      }      
    }
  }  

  public async onRefreshTokenClick(token: AppToken): Promise<void>{
    const newToken: AppToken = {
      appName : token.appName,
      token: token.token,
      expiryUtc: + moment().utc().add(7, 'days').format('X')
    }
    try{
      const apiResponse = await this._tokenService.addEditToken(newToken);
      
      if(apiResponse.success){
        this._toastr.success('', 'Token Expiry updated to 7 Days from now');
      }else{
        this._toastr.error('apiResponse.errorMessage', 'API Error while refreshing token');
        this.getData();
      }
    }
    catch(e){
      console.log(e);
      this._toastr.error('', 'Error refreshing token');
    }
  }

  private rerenderTable(): void {
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();  
      });
    }else{
      this.dtTrigger.next();  
    }      
  }

}
