import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { MyProfileComponent } from './main/my-profile/my-profile.component';
import { ChangePasswordComponent } from './main/change-password/change-password.component';
import { ProductListingComponent } from './main/product-listing/product-listing.component';
import { ProductDetailComponent } from './main/product-detail/product-detail.component';
import { SubCategoriesPageComponent } from './main/sub-categories-page/sub-categories-page.component';
import { BrandsPageComponent } from './main/brands-page/brands-page.component';
import { CartPageComponent } from './main/cart-page/cart-page.component';
import { ForgotpasswordComponent } from './main/forgotpassword/forgotpassword.component';
import { OrderCompleteThankyouComponent } from './main/order-complete-thankyou/order-complete-thankyou.component';
import { MyWalletPageComponent } from './main/my-wallet-page/my-wallet-page.component';
import { TermsConditionsComponent } from './main/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';
import { ShippingPolicyComponent } from './main/shipping-policy/shipping-policy.component';
import { ReturnExchangeComponent } from './main/return-exchange/return-exchange.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { ContactUsComponent } from './main/contact-us/contact-us.component';
import { MyOrderComponent } from './main/my-order/my-order.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { PaymentComponent } from './main/payment/payment.component';
import { PayresponseComponent } from './main/payment/payresponse/payresponse.component';
import { PaymentfailComponent } from './main/paymentfail/paymentfail.component';
import { AccountSettingSidenavComponent } from './main/account-setting-sidenav/account-setting-sidenav.component';
import { AddressesComponent } from './main/addresses/addresses.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'sub-categories', component: SubCategoriesPageComponent },
  { path: 'brands-page', component: BrandsPageComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'product',  component: ProductListingComponent 
  },
  { path: 'product',  
    children : [{  path : ':cid', component: ProductListingComponent }]
  },
  { path: 'product',  
    children : [{  path : ':/:/:cid', component: ProductListingComponent }]
  },
  { path: 'product',  
    children : [{  path : ':parent_category/:category/:cid', component: ProductListingComponent }]
  },
  { path: 'product/detail',
      children : [{  path : ':pid', component: ProductDetailComponent }]
  },
  { path: 'product',
      children : [{  path : ':/:/:/:pid', component: ProductDetailComponent }]
  },
  { path: 'product',
      children : [{  path : ':/:/:/:/:pid', component: ProductDetailComponent }]
  },
  { path: 'productcart',
      children : [{  path : ':/:/:pid', component: ProductDetailComponent }]
  },
  
  { path: 'product-brandid',  
      children : [{  path : ':bid', component: ProductListingComponent }]
  },
  { path: 'product',  
      children : [{  path : ':/:bid', component: ProductListingComponent }]
  },
  { path: 'brands-page/product-brandid',  
      children : [{  path : ':bid', component: ProductListingComponent }]
  },
  { path: 'product',  
      children : [{  path : ':/:bid', component: ProductListingComponent }]
  },
  { 
    path: 'forgotpassword',
    children : [{  path : ':uid', component: ForgotpasswordComponent }]
  },
  { path: 'cart', component: CartPageComponent },
  { path: 'thankyou', component: OrderCompleteThankyouComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'shipping-policy', component: ShippingPolicyComponent },    
  { path: 'return-exchange', component: ReturnExchangeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'my-order', component: MyOrderComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment', component: PaymentComponent },   
  { path: 'payresponse', component: PayresponseComponent }, 
  { path: 'paymentfail', component:  PaymentfailComponent },
  { path: 'addresses', component: AddressesComponent },
  { path: 'account-setting-sidenav', component: AccountSettingSidenavComponent },
  { path: 'account-setting-sidenav', component: AccountSettingSidenavComponent,
    children: [
      {path: 'my-profile', component: MyProfileComponent},
      {path: 'my-order', component: MyOrderComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'addresses', component: AddressesComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
