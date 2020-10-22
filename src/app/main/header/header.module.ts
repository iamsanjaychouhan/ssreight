import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatMenuModule} from '@angular/material/menu';
import { MatCardModule, MatIconModule, MatToolbarModule, MatInputModule, MatExpansionModule, MatListModule } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from "ngx-spinner";
//import { AutoTabDirective } from '../header/autotab-directive';
//import { RatingModule } from 'ng-starrating';

//import { LoginOpanPopup,ForgotOpanPopup,UserTypePopup,UserRegisterPopup,CompaniRegisterPopup,VerificationPopup, DealerWelcomePopup, ProjectEnquiryDialog,BulkEnquiryDialog, SellonSefetywagonDialog, SuccessfullFormSubmitPopup } from '../header/header.component';

@NgModule({
  declarations: [
    //AutoTabDirective,
    // LoginOpanPopup,
    // ForgotOpanPopup,
    // UserTypePopup,
    // UserRegisterPopup,
    // CompaniRegisterPopup,
    // VerificationPopup,
    // DealerWelcomePopup,
    // SuccessfullFormSubmitPopup,
    // ProjectEnquiryDialog,
    // BulkEnquiryDialog,
    // SellonSefetywagonDialog       
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSliderModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule
    
  ],
  entryComponents: [
    // LoginOpanPopup,
    // ForgotOpanPopup,
    // UserTypePopup,
    // UserRegisterPopup,
    // CompaniRegisterPopup,
    // VerificationPopup,
    // DealerWelcomePopup,
    // SuccessfullFormSubmitPopup,
    // ProjectEnquiryDialog,
    // BulkEnquiryDialog,
    // SellonSefetywagonDialog
  ],
  providers: [CookieService],
  bootstrap: []
})
export class HeaderModule { }
