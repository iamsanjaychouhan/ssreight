import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA, MAT_PAGINATOR_INTL_PROVIDER} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

export interface SubCategories {
  value: string;
  viewValue: string;
}
export interface DialogData {
  orderid: any;
  productid: any;
}

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {

  subcategories: SubCategories[] = [
    {value: 'all', viewValue: 'All'},
    {value: 'shipped', viewValue: 'Shipped'},
    {value: 'confirmed', viewValue: 'Confirmed'},
    {value: 'completed', viewValue: 'Completed'},
    {value: 'cancelled', viewValue: 'Cancelled'}
  ];

  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  results=""; link="";
  productid=""; orderid=""; ratting = 'false';

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private router:Router ) {}

  ngOnInit() {
      //orderslist
      this.userdata = this.localStorage.getItem('userdata');  
      if(this.userdata!=null){
        let sessdata = JSON.parse(this.userdata); 
        if(sessdata!=='' || sessdata!=='null'){
          this.uids = sessdata.user_id;
        } 
      }
      this.deviceId = this.userService.generatecookie();
      //this.AccessToken = this.userService.GetAccessToken();
      setTimeout (() => {
        this.AccessToken = this.userService.GetAccessToken();
        this.orderlist('all');
     }, 100);
      
  }

  // Order List
  orderlist(types){ 
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      order_type:types
    };
    // Order list
    this.userService.Cartcommand('/orderslistweb',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            //console.log(info);
            this.results = info.data;
            this.link = info.product_img_link;
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  rateProductPopup(productId,orderid) { 
    const dialogRef = this.dialog.open(rateProductPopup,{data:{'orderid':orderid,'productId':productId} });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  requestInstallationPopup(productId,orderid) { console.log(productId+' -- '+orderid);
    const dialogRef = this.dialog.open(requestInstallationPopup,{data:{'orderid':orderid,'productId':productId} });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cancelConfirmationPopup(orderid) { 
    const dialogRef = this.dialog.open(cancelConfirmationPopup);
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined){
        this.ordercancel(orderid);
      }
    });
  }

  ordercancel(orderid){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      order_id:orderid,
      action:'cancel'
    };
    // Order Cancel
    this.userService.Cartcommand('/orderCancel',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            //console.log(info.data);
            this.orderlist('all');
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  reorder(orderid){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      order_id:orderid
    };
    // Order Cancel
    this.userService.Cartcommand('/reordercart',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            if(info.status==1)
              this.window.location.href="/cart"
            //this.orderlist('all');
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  // View Invoice
  viewinvoice(orderid){ 
    this.data = {
      uid: this.uids,
      order_id:orderid
    };
    // Order Cancel
    this.userService.Cartcommand('/viewinvoice',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            //console.log(info);
            setTimeout (() => { 
              //server location
              this.window.open('https://safetywagon.com/saftywagonweb_Application/src/assets/invoice/'+info.response_message, '_blank'); }, 1000);
              //window.open('/assets/invoice/'+info.response_message, '_blank'); }, 1000);
        },
        error => {
          //var info=JSON.parse(JSON.stringify(error));
    });
  }


}


@Component({
  selector: 'dialog-rate-product',
  templateUrl: 'dialog-rate-product.html',
  styleUrls: ['./my-order.component.scss']
})

export class rateProductPopup {
  star_review=''; starrate="";
  productid=""; orderid="";
  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0; ratesuccess=''; rateerror='';
  messages='';

  constructor( 
    public dialogRef: MatDialogRef<rateProductPopup>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public ratedata:DialogData,
    private userService: UsersService
    ) {} 

    ngOnInit() {
      //orderslist
        this.userdata = localStorage.getItem('userdata');  
        if(this.userdata!=null){
          let sessdata = JSON.parse(this.userdata); 
          if(sessdata!=='' || sessdata!=='null'){
            this.uids = sessdata.user_id;
          } 
        }
        this.deviceId = this.userService.generatecookie();
        this.AccessToken = this.userService.GetAccessToken();
    }
    
    ratesubmit(){ 
      this.orderid = this.ratedata['orderid'];
      this.productid = this.ratedata['productId'];
      if(this.star_review=="" || this.starrate==""){
        this.rateerror = 'error';
        this.messages = 'Please given to star ratting and review';
        return false;
      }
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        order_id:this.orderid,
        review: this.star_review,
        rate: this.starrate,
        product_id: this.productid
      };
      
      // Rate Review
      this.userService.Cartcommand('/inputReview',this.data)
      .subscribe(
          result => {  
              var info = JSON.parse(JSON.stringify(result)); 
             
              if(info.status==1){
                this.ratesuccess = 'success';
                this.messages = 'Your rate successfully submitted';
              }
              else{
                this.rateerror = 'error';
                this.messages = info.response_message;
              }
              setTimeout (() => { this.dialogRef.close(); }, 1500);
           },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      });

    }
    onRate(event){
      this.starrate = event.newValue;
      console.log(event.newValue);
    }
}

@Component({
  selector: 'dialog-request-installation',
  templateUrl: 'dialog-request-installation.html',
  styleUrls: ['./my-order.component.scss']
})

export class requestInstallationPopup {

  productid=""; orderid="";
  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0; 
  fullname=''; fullname_err="";
  mobile_no=""; mobile_no_err="";
  emailaddress=""; emailaddress_err="";
  message=""; message_err="";
  successMsg="";
  token= true;
  constructor( 
    public dialogRef: MatDialogRef<requestInstallationPopup>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public requestdata:DialogData,
    private userService: UsersService
    ) {} 

    ngOnInit() {
      //Initial get Data
        this.userdata = localStorage.getItem('userdata');  
        if(this.userdata!=null){
          let sessdata = JSON.parse(this.userdata); 
          if(sessdata!=='' || sessdata!=='null'){
            this.uids = sessdata.user_id;
          } 
        }
        this.deviceId = this.userService.generatecookie();
        this.AccessToken = this.userService.GetAccessToken();
    }

    submitInstallation(){ 
      this.orderid = this.requestdata['orderid'];
      this.productid = this.requestdata['productId'];
      this.fullname_err=''; this.mobile_no_err=''; this.emailaddress_err=''; this.message_err='';
      this.successMsg='';
      this.token=true;
      if(this.fullname==""){
        this.fullname_err = 'Please insert your name'; this.token = false;
      }
      if(this.mobile_no==""){
        this.mobile_no_err = 'Please insert your mobile number'; this.token = false;
      }
      if(this.emailaddress==""){
        this.emailaddress_err = 'Please insert your email address'; this.token = false;
      }
      if(this.message==""){
        this.message_err = 'Please insert your message or query'; this.token = false;
      }
      console.log(this.token);
      if(this.token==false) return false;

      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        order_id: this.orderid,
        product_id: this.productid,
        full_name: this.fullname,
        mobile_no: this.mobile_no,
        email_id: this.emailaddress,
        message: this.message
      };
      
      // Rate Review
      this.userService.Apicommand('/installationRequest',this.data)
      .subscribe(
          result => {  
              var info = JSON.parse(JSON.stringify(result)); 
              //console.log(info);
              if(info.status==1){
                this.successMsg = "Your installation request send successfully";
                setTimeout (() => { this.dialogRef.close(); }, 1500);
              }
              else{

                if(info.response_message.email_address && info.status==0)
                  this.emailaddress_err = info.response_message.email_address;
                if(info.response_message.mobile_number && info.status==0)
                  this.mobile_no_err = info.response_message.mobile_number;
              }
              
           },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      });
    }

}

@Component({
  selector: 'dialog-cancel-confirmation',
  templateUrl: 'dialog-cancel-confirmation.html',
  styleUrls: ['./my-order.component.scss']
})

export class cancelConfirmationPopup {
  constructor( 
    public dialogRef: MatDialogRef<cancelConfirmationPopup>,
    public dialog: MatDialog
    ) {} 
}