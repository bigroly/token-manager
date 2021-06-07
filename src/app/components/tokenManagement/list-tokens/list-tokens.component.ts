import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AppToken } from 'src/app/models/token/appToken.model';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-list-tokens',
  templateUrl: './list-tokens.component.html',
  styleUrls: ['./list-tokens.component.scss']
})
export class ListTokensComponent implements OnInit {
  
  public dtOptions: DataTables.Settings = {};
  public persons: AppToken[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private _tokenService: TokenService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
    
    // this.httpClient.get<Person[]>('data/data.json')
    //   .subscribe(data => {
    //     this.persons = (data as any).data;
        
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next();
    //   });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
