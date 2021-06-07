import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AppToken } from 'src/app/models/token/appToken.model';
import { TokenService } from 'src/app/services/token.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddTokenComponent } from '../add-token/add-token.component';

@Component({
  selector: 'app-list-tokens',
  templateUrl: './list-tokens.component.html',
  styleUrls: ['./list-tokens.component.scss']
})
export class ListTokensComponent implements OnInit {
  
  public dtOptions: DataTables.Settings = {};
  public tokens: AppToken[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private _tokenService: TokenService, private _toastr: ToastrService, private _modalService: NgbModal, private _utils: UtilityService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };

    this.getData();
  }

  private async getData(): Promise<void> {
    try{
      const getTokensResp = await this._tokenService.listTokens();
      if(getTokensResp.success){
        this.tokens = getTokensResp.tokens;
        this.dtTrigger.next();
      }
      else{
        this._toastr.error('', 'Server error obtaining Token Information');
      }
    }
    catch (e){
      console.log(e);
      this._toastr.error('', 'Error obtaining Token Data');
    }

  }

  public displayLocalTokenDateTime(expiryUtc: number): string{
    return this._utils.utcEpochToLocalString(expiryUtc);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public onAddTokenClick(): void{
    const modalRef = this._modalService.open(AddTokenComponent, {size: 'xl', backdrop: 'static'});

    modalRef.closed.subscribe(newToken => {
      if(newToken != null){
        this.tokens.push(newToken);
        this.dtTrigger.next();
      }
    })
  }

}
