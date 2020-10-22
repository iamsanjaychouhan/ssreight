import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatMenuModule } from '@angular/material/menu';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxImageZoomModule } from 'ngx-image-zoom';
//import { NgxGalleryModule } from 'ngx-gallery';
import { ToastrModule } from 'ngx-toastr';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatCardModule, MatIconModule, MatBottomSheetModule, MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatListModule,MatRadioModule,MatProgressBarModule,MatChipsModule,MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'ng-starrating';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { StickyNavModule } from 'ng2-sticky-nav';
//import { RatingModule } from 'ng-starrating';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { AutoTabDirective } from './main/header/autotab-directive';
import { RemovewhitespacesPipe } from './custompipe/removewhitespaces.pipe';
//I keep the new line
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { LoginOpanPopup,ForgotOpanPopup,UserTypePopup,UserRegisterPopup,CompaniRegisterPopup,VerificationPopup, DealerWelcomePopup, ProjectEnquiryDialog,BulkEnquiryDialog, SellonSefetywagonDialog, SuccessfullFormSubmitPopup } from './main/header/header.component';
import { FooterComponent } from './main/footer/footer.component';
import { HomeComponent } from './main/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyProfileComponent, UpdateProfilePopup } from './main/my-profile/my-profile.component';
import { ChangePasswordComponent } from './main/change-password/change-password.component';
import { ChangePasswordPopup } from './main/change-password/change-password.component';
import { ProductListingComponent } from './main/product-listing/product-listing.component';
import { ProductDetailComponent, SizeColorPopup,ProductInstallationPopup, ViewShippingDetailDialog, CallBackPopup, SuccessfullCallBackPopup, ComparePopup, EasyReturnPopup, SharePopup, OfferPopup } from './main/product-detail/product-detail.component';
import { SubCategoriesPageComponent } from './main/sub-categories-page/sub-categories-page.component';
import { BrandsPageComponent } from './main/brands-page/brands-page.component';
import { coupanAppliedPopup } from './main/cart-page/cart-page.component';
import { CartPageComponent, ViewShippingDetailPopup } from './main/cart-page/cart-page.component';
import { removeItemConfirmationPopup } from './main/cart-page/cart-page.component';
import { ForgotpasswordComponent } from './main/forgotpassword/forgotpassword.component';
import { OrderCompleteThankyouComponent } from './main/order-complete-thankyou/order-complete-thankyou.component';
import { TermsConditionsComponent } from './main/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';
import { ShippingPolicyComponent } from './main/shipping-policy/shipping-policy.component';
import { ReturnExchangeComponent } from './main/return-exchange/return-exchange.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { MyOrderComponent } from './main/my-order/my-order.component';
import { rateProductPopup } from './main/my-order/my-order.component';
import { requestInstallationPopup } from './main/my-order/my-order.component';
import { cancelConfirmationPopup } from './main/my-order/my-order.component';
import { CheckoutComponent, coupanAppliedPopupDailog} from './main/checkout/checkout.component';
import { PaymentComponent } from './main/payment/payment.component';
import { PayresponseComponent } from './main/payment/payresponse/payresponse.component';
import { PaymentfailComponent } from './main/paymentfail/paymentfail.component';
import { ContactUsComponent } from './main/contact-us/contact-us.component';
import { AccountSettingSidenavComponent } from './main/account-setting-sidenav/account-setting-sidenav.component';
import { AddressesComponent, removeAddConfirmationPopup } from './main/addresses/addresses.component';
//created
import { MyWalletPageComponent } from './main/my-wallet-page/my-wallet-page.component';
import { LoginCartComponent } from './main/login-cart/login-cart.component';
import { TrackOrderComponent } from './main/track-order/track-order.component';
import { ToastComponent } from './toast/toast.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'safetywagonweb'   
    }),
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatMenuModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatRadioModule,
    MatChipsModule,
    MatSliderModule,
    MatSidenavModule,
    HttpClientModule,
    MatDatepickerModule,
    NgxImageZoomModule.forRoot(),
    NgxSpinnerModule,
    //NgxGalleryModule,
    Ng5SliderModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RatingModule,
    CarouselModule,
    MatNativeDateModule,
    MatTabsModule,
    StickyNavModule,   
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    }), AppModule, BrowserTransferStateModule,
    
  ],
  
  entryComponents: [
    UpdateProfilePopup,
    SizeColorPopup,
    ProductInstallationPopup,
    ChangePasswordPopup,
    removeItemConfirmationPopup,
    removeAddConfirmationPopup,
    coupanAppliedPopup,
    ViewShippingDetailPopup,
    coupanAppliedPopupDailog,
    cancelConfirmationPopup,
    requestInstallationPopup,
    rateProductPopup,
    LoginOpanPopup,
    ForgotOpanPopup,
    UserTypePopup,
    UserRegisterPopup,
    CompaniRegisterPopup,
    VerificationPopup,
    ProjectEnquiryDialog,
    SuccessfullFormSubmitPopup,
    SuccessfullCallBackPopup,
    BulkEnquiryDialog,
    SellonSefetywagonDialog,
    DealerWelcomePopup,
    ViewShippingDetailDialog,
    CallBackPopup,
    ComparePopup,
    EasyReturnPopup,
    SharePopup,
    OfferPopup,
    //FilterSheet,
    //SortingSheet

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
}
