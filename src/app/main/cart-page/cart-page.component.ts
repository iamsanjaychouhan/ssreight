import { Component, OnInit, Inject } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  confirmoption='';
  data :any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;usertype;
  results="";
  link="";
  session : any;
  cartcount;
  totalprice; 
  totaltax=""; subtotal="";
  quantitys=0;
  result:any;
  quantity=1;
  qtyerr=""; errId=""; coupons=""; coupommessage=""; 
  coupondiscount=""; couponid=""; couponcode="";
  shippingPrice="";newpincode;shipdata;topay;amount_err;moq_err="";

  private activatedRouteSubscription:Subscription;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit() {
    this.result = {'quantity':1 };
    this.userdata = this.localStorage.getItem('userdata');
    if(this.userdata)
      this.session = JSON.parse(this.userdata);
    else
      this.session = '';
    //created code end
    this.userdata = this.localStorage.getItem('userdata');
    if(this.userdata!=null){
      let sessdata = JSON.parse(this.userdata); 
      if(sessdata!=='' || sessdata!=='null') this.uids = sessdata.user_id;this.usertype = sessdata.user_type
    }
    this.deviceId = this.userService.generatecookie();
    setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.cartlist();
      this.couponlist();
    }, 100);
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1500);    
  }


  openShippingDialog() {
    const dialogRef = this.dialog.open(ViewShippingDetailPopup,{
      width: '90%',
      height: '80%'
      }      
      );
    dialogRef.afterClosed().subscribe(result => { 
      console.log(`Dialog result: ${result}`);
    });
  }


  // Cart List
  cartlist(){
    /*created code for get pincode*/
      this.newpincode = this.localStorage.getItem('newpincode');
    /*created code end here*/
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      pincode:this.newpincode
    };  
    // Add To Cart
    this.userService.Cartcommand('/listCart',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          //if(info.status==0){
            //this.router.navigate(['/']);
          //}
          this.results = info.data;
          //console.log(this.results);debugger;
          this.link = info.product_img_link;
          this.totalprice = info.total_price+info.shipdata;
          this.totaltax = info.totaltax;
          this.subtotal = info.subtotal;
          this.shippingPrice = info.shipping;
          this.shipdata = info.shipdata;
          const cartcounts = info.cartcount;
          this.localStorage.removeItem('cartcount');
          this.localStorage.setItem('cartcount',cartcounts);
          this.cartcount = this.localStorage.getItem('cartcount');
          if(info.cartRow!=null && info.cartRow.discount!=0.00)
            this.coupondiscount = info.cartRow.discount;
          else this.coupondiscount = "";
          if(info.cartRow!=null && info.cartRow.promo_code_id>0)
            this.couponid = info.cartRow.promo_code_id;
          else this.couponid="";
          if(info.couponcode.coupon_code!="")
            this.couponcode = info.couponcode.coupon_code;
          else this.couponcode="";
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }
  // Remove Cart Item
  removecartItem(itemid,cartid,productid){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      item_id:itemid,
      cart_id:cartid,
      product_id:productid
    };
    
    // Remove Cart Item
    this.userService.Cartcommand('/deleteItem',this.data)
    .subscribe(
        catresult => {  
           var info = JSON.parse(JSON.stringify(catresult)); 
           //console.log(info);
           this.cartlist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 

  }

  removeItemConfirmationPopup(itemid,cartid,productid) { 
    const dialogRef = this.dialog.open(removeItemConfirmationPopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
        //this.removecartItem(itemid,cartid,productid);
        if(result!=undefined){
          console.log('Yes clicked');
          this.removecartItem(itemid,cartid,productid);
        }
          
    });
  }

  // Update Cart
  updatecart(itemid,cartid,productid,quantity,size,color){
    this.qtyerr='';
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      item_id:itemid,
      cart_id:cartid,
      product_id:productid,
      quantity:quantity,
      size:size,
      color:color
    };
    // Remove Cart Item
    this.userService.Cartcommand('/updateCart',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          //console.log(info);
          if(info.status==0){
            this.errId = itemid;
            this.qtyerr = info.response_message;
          } 
          else
            this.cartlist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  minus(itemid,cartid,productid,quantity,moq,size,color){
    if(moq < quantity){
      if(quantity>0) quantity=quantity-1;
      this.updatecart(itemid,cartid,productid,quantity,size,color);
    }else
    {
      this.moq_err="Minimum Order Quantity is ";  
    }
  }
  plus(itemid,cartid,productid,quantity,size,color){
    if(this.totalprice <= 999999){
      if(quantity>0) quantity=parseInt(quantity)+1;
        this.updatecart(itemid,cartid,productid,quantity,size,color);
      }else{
        this.amount_err = 'Amount should be less than 10,00000';
      }
  }

  
    coupanAppliedPopup(couponcode,orderval,action) {
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        coupon_code:couponcode,
        action: action,
        order_value:orderval
      };
      // Coupon Applied
      this.userService.Cartcommand('/inputCoupon',this.data)
      .subscribe(
          catresult => {  
             var info = JSON.parse(JSON.stringify(catresult)); 
             //console.log(info);
             if(info.status==0){
               this.errId = info.couponid;
               this.coupommessage = info.response_message;
               return false;
             }
             this.cartlist();
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      }); 
      //return false;
      const dialogRef = this.dialog.open(coupanAppliedPopup);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

    }


    openNav() {
      document.getElementById("mySidenav").style.cssText = "width: 400px; padding: 55px 35px 20px 35px";
    }
    
    closeNav() {
      document.getElementById("mySidenav").style.cssText = "width: 0px; padding: 0px";
    }
    couponlist(){
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids        
      };
     
      // Remove Cart Item
      this.userService.Cartcommand('/couponList',this.data)
      .subscribe(
          catresult => {  
            var info = JSON.parse(JSON.stringify(catresult)); 
            //console.log(info.data);
            this.coupons = info.data;
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      }); 
    }
}
//updateCart

@Component({
  selector: 'view-shipping-detail',
  templateUrl: 'view-shipping-detail-popup.html',
  styleUrls: ['cart-page.component.scss'],
})
export class ViewShippingDetailPopup {
  constructor(public dialog: MatDialog) {}
  openDialog() {
    const dialogRef = this.dialog.open(ViewShippingDetailPopup);
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }
}


@Component({
  selector: 'dialog-remove-item-confirmation',
  templateUrl: 'dialog-remove-item-confirmation.html',
  styleUrls: ['./cart-page.component.scss']

})
export class removeItemConfirmationPopup {
  confirmoption:'';
  constructor( 
    public dialogRef: MatDialogRef<removeItemConfirmationPopup>,
    public dialog: MatDialog
    ) {} 

    confirmbtn(confm){
      this.confirmoption = confm;
      console.log(this.confirmoption);
    }
}

@Component({
  selector: 'dialog-coupan-applied',
  templateUrl: './dialog-coupan-applied.html',
  styleUrls: ['./cart-page.component.scss']

})

export class coupanAppliedPopup {
  constructor( 
    public dialogRef: MatDialogRef<coupanAppliedPopup>,
    public dialog: MatDialog
    ) {} 

    closeNav() {
      document.getElementById("mySidenav").style.cssText = "width: 0px; padding: 0px";
    }
}