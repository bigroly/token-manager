import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/auth/login/login.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListTokensComponent } from './components/tokenManagement/list-tokens/list-tokens.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { DataTablesModule } from 'angular-datatables';
import { AddTokenComponent } from './components/tokenManagement/add-token/add-token.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListTokensComponent,
    NavbarComponent,
    AddTokenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
