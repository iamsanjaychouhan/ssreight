import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  bounce: any;
  data :any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0; usermobile=""; userwallet=0; username=""; usertype=''; useremail="";
  addreslist=""; selected=""; ordersummaryOpt="close";deliveryadress="";
  payopt="close";
  orderlist=""; errId="";qtyerr="";
  results="";
  session:any;
  link="";
  cartcount="";
  totalprice:''; 
  totaltax=""; subtotal="";
  payoption="";
  paymentoption="";
  paymentoption_err=""; uaid='';
  cart_id='';
  newaddress="";
  coupondiscount=""; couponid=""; couponcode="";
  coupommessage=""; coupons="";
  todayNumber: number = Date.now();
  gstin=""; email_id=""; address_name="";  city_name=""; state_name=""; pincode=""; addresstype=""; action="";
  gstin_err=""; email_id_err=""; address_name_err="";  city_name_err=""; state_name_err=""; pincode_err=""; addresstype_err="";
  token=true; addresId='';
  shippingPrice=""; payuform:any; hashkey=""; udf4='';udf3='';newpincode='';shipdata; 

  //created code for personal and company
  uname="";mobile_no="";name_err="";mobile_no_err="";landmark="";alt_phone="";gst_err="";gst="";uemail;current_address:any;addresid:any;invoiceadd:any;moq_err="";
  //created code end here

  selectedoption: string;
  buytypes: string[] = ['Business', 'Personal'];

  //radio button selected code start
  private selectedLink: string="buytype"; 
  setradio(e: string): void{  
    this.selectedLink = e;  
  }
  
  isSelected(name: string): boolean{  
    if (!this.selectedLink) {
      return false;  
    }  
    return (this.selectedLink === name);
  }  
    
 
  
  //cancel method
  public hitCancel:boolean=false;
    cancel(){
      this.hitCancel=true;
    }

  //created code for login
  loading = false;
  submitted = false;
  username_err='';
  password_err='';password='';
  //created code end

  constructor(@Inject(WINDOW) private window: Window,@Inject(LOCAL_STORAGE) private localStorage: any, 
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.userdata = this.localStorage.getItem('userdata');  
    if(this.userdata)
      this.session = JSON.parse(this.userdata);
    else
      this.session = '';
    if(this.userdata!=null){
      let sessdata = JSON.parse(this.userdata); 
      if(sessdata!=='' || sessdata!=='null'){
        this.uids = sessdata.user_id;
        this.usermobile = sessdata.mobile;
        this.username = sessdata.name;
        this.userwallet = sessdata.my_credits;
        this.usertype = sessdata.user_type;
        this.useremail = sessdata.email;
      } 
    }
    this.deviceId = this.userService.generatecookie();
    //setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.addresslist();
      this.cartlist();
      this.couponlist();
    //}, 80);

    //setTimeout (() => { console.log(this.payuform); this.generatehash(this.payuform); }, 500);
    /** spinner starts on init */
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);

  }


  //created code for login
  onSubmit() {
    this.submitted = true;
    this.username_err = '';  this.password_err='';
    this.token = true;
    if(this.username==""){ this.username_err = 'Please enter your email address or mobile number'; this.token = false; }
    if(this.password==""){ this.password_err = 'Please enter your password'; this.token = false; }
    if(this.token==true){
      this.deviceId = this.userService.generatecookie();
      this.AccessToken = this.userService.GetAccessToken();
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        email:this.username,
        password:this.password
      };
      this.userService.login(this.data)
      .subscribe(
          data => {  
            var info = JSON.parse(JSON.stringify(data));
            //console.log(info); return false;
            if(info.status==0){
              this.password_err = info.response_message;
            }else{
              this.localStorage.setItem('userdata', JSON.stringify(info.data));
              location.reload();
            }
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
              //this.loading = false;
      });        
    }     
  }
  
  // Update Cart
  updatecart(itemid,cartid,productid,quantity){
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
      quantity:quantity
    };
   
    // Remove Cart Item
    this.userService.Cartcommand('/updateCart',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          if(info.status==0){
            this.errId = itemid;
            this.qtyerr = info.response_message;
          } 
          else
            this.cartlist('update');
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  minus(itemid,cartid,productid,quantity,moq){
    if(moq < quantity){
      if(quantity>0) quantity=quantity-1;
      this.updatecart(itemid,cartid,productid,quantity);
    }else
    { 
      //console.log('error');
      this.moq_err="Minimum Order Quantity is ";  
    }    
    //if(quantity>0) quantity=quantity-1;
    //this.updatecart(itemid,cartid,productid,quantity);
  }
  plus(itemid,cartid,productid,quantity){
    if(quantity>0) quantity=parseInt(quantity)+1;
    this.updatecart(itemid,cartid,productid,quantity);    
  }
  // Cart List
  cartlist(updatecart=''){
    this.newpincode = this.localStorage.getItem('newpincode');
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      pincode: this.newpincode
    };
    // list
    this.userService.Cartcommand('/listCart',this.data)
    .subscribe(
        result => {  
          var info = JSON.parse(JSON.stringify(result)); 
          this.orderlist = info.data;
            if(info.status==1){
              if(updatecart=='update'){
                this.selected="selected";
                this.ordersummaryOpt="open";
              }
              this.orderlist = info.data;
              this.link = info.product_img_link;
              this.totalprice = info.total_price+info.shipdata;
              this.totaltax = info.totaltax;
              this.subtotal = info.subtotal;
              this.cartcount = info.cartcount;
              this.cart_id = info.cart_id;
              this.shippingPrice = info.shipping;
              /*created code for showing shipping*/
              this.shipdata = info.shipdata;

              //console.log(this.orderlist);
              //this.payuform.udf3 = info.cart_id;
              //this.payuform.udf4 = this.uaid;

              // this.payuform = {'firstname':this.username,'phone':this.usermobile,'email':this.useremail,'amount':this.totalprice,'surl':'http://localhost:8080/safetywagon_backend/cart/onlineresponse','furl':'http://localhost:8080/safetywagon_backend/cart/onlineresponse','key':'gtKFFx','salt':'eCwWELxi','hash':this.hashkey,'txnid':this.todayNumber,'productinfo':'test product','udf5':this.uids,'udf4':this.uaid,'udf3':this.cart_id };
              
              //localStorage.removeItem('cartcount');
              //localStorage.setItem('cartcount',cartcounts);
              //this.cartcount = localStorage.getItem('cartcount');
              if(info.cartRow.discount!=0.00)
                this.coupondiscount = info.cartRow.discount;
              else this.coupondiscount = "";
              if(info.cartRow.promo_code_id>0)
                this.couponid = info.cartRow.promo_code_id;
              else this.couponid="";
              if(info.couponcode.coupon_code!="")
                this.couponcode = info.couponcode.coupon_code;
              else this.couponcode="";
           } 

         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  ordercontinue(){
    this.ordersummaryOpt="count";
    this.payopt = "open";
    //console.log(this.uaid+' ==== '+this.cart_id);
    //this.payuform.udf4 = this.uaid;
    //this.payuform.udf3 = this.cart_id;
    /*this.payuform = {'firstname':this.username,'phone':this.usermobile,'email':this.useremail,'amount':this.totalprice,'surl':'http://localhost/safetywagon_web/safetywagon_backend/cart/onlineresponse','furl':'http://localhost/safetywagon_web/safetywagon_backend/cart/onlineresponse','key':'gtKFFx','salt':'eCwWELxi','hash':this.hashkey,'txnid':this.todayNumber,'productinfo':'test product','udf3':this.cart_id,'udf4':this.uaid,'udf5':this.uids };
    this.generatehash(this.payuform);*/


    this.payuform = {'firstname':this.username,'phone':this.usermobile,'email':this.useremail,'amount':this.totalprice,'surl':'https://safetywagon.com/safetywagon_backend/cart/onlineresponse','furl':'https://safetywagon.com/safetywagon_backend/cart/onlineresponse','key':'eTcTle7w','salt':'xBbPsbOe6k','hash':this.hashkey,'txnid':this.todayNumber,'productinfo':'safetywagon product','udf3':this.cart_id,'udf4':this.uaid,'udf5':this.uids };
    this.generatehash(this.payuform);
  }
  // pay Online Form Open
  payonline(){
    this.payoption = 'online';
  }
  paydirect(){
    this.payoption = 'offline';
  }
  // Pay now
  paynow(cartid){
    //console.log(this.uaid);
    /*if(this.invoiceadd !=''){
      this.uaid = this.invoiceadd;
    }else{
      this.uaid;
    }*/
    this.paymentoption_err='';
    if(this.paymentoption=="") {
      this.paymentoption_err="Please choose at least on payment option"; return false;
    } 
    if(this.paymentoption=='wallet' && this.userwallet<=0){
      this.paymentoption_err="Please choose another payment option"; return false;
    } 
    //console.log(this.paymentoption); 
    // Without Online
    if(this.paymentoption!='online')
    { 
      this.newpincode = this.localStorage.getItem('newpincode');
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        cart_id:cartid,
        uaid:this.uaid,
        type:this.paymentoption,
        pincode:this.newpincode,
        userwallet:this.userwallet,
        shipping:this.shipdata
      };
      this.spinner.show();
      this.userService.Cartcommand('/cartPayment',this.data)
      .subscribe(
          catresult => {  
            var info = JSON.parse(JSON.stringify(catresult)); 
            if(info.status==1){
              this.localStorage.removeItem('cartcount');
              this.cartcount = "";
              this.window.location.href="/thankyou";
            }
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      }); 
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
    const dialogRef = this.dialog.open(coupanAppliedPopupDailog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
  openNav() {
    document.getElementById("mySidenav").style.cssText = "width: 400px; padding: 55px 35px 20px 35px";
  }
  closeNav() {
    document.getElementById("mySidenav").style.cssText = "width: 0px; padding: 0px";
  }

  //created code end here
  // Address List
  addresslist(uaid=''){
    /*const current_address = uaid;
    this.invoiceadd = current_address;*/
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid:uaid
    };
    // list
    this.userService.Apicommand('/changeAddresslist',this.data)
    .subscribe(
        result => {  
          var info = JSON.parse(JSON.stringify(result)); 
          this.addreslist = info.data;
          if(uaid!="")
          {
            this.uaid= uaid;
            this.selected="selected";
            this.ordersummaryOpt="open";
            //console.log('This'+uaid);
          } 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  // Select Address
  selectaddress(addresid){
    this.addresslist(addresid);
    //this.paynow(addresid);
    //console.log(addresid);debugger;
  }

  NewAddress(){
    this.newaddress = 'NewAddress';
  }
  ChangeSelectedAddress(){
    this.selected='';
    this.addresslist();
  }
  OpenOrderSummary(){
    this.ordersummaryOpt="open";   
  }
  // Add new address
  saveaddresspersonal(){
    this.addresId='';
    this.name_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";this.addresstype_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.addresstype==""){ this.addresstype_err = 'Please choose location'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      address_type: this.addresstype,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Personal'
    };
    this.userService.Apicommand('/addNewdeliveradrs',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult));
          this.newaddress='';
          this.addresslist();
          if(info.address_id !=''){
            this.deliveryadress="close";
          }

        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  saveaddressBusiness(){
    this.addresId='';
    this.name_err="";this.gst_err="";this.email_id_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.gst==""){this.gst_err = 'Please enter your gst'; this.token = false; }
    if(this.email_id==""){this.email_id_err = 'Please enter your email'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      gst:this.gst,
      email:this.email_id,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Business'
    };
    //console.log(this.data);debugger;
    this.userService.Apicommand('/addNewdeliveradrs',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult));
          this.newaddress='';
          this.addresslist();
          if(info.data.address_id!=''){
            this.deliveryadress='close';
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  viewaddress(addressid){
    //console.log(addressid);debugger;
    this.newaddress='NewAddress';
    //this.deliveryadress='close';
    this.action='edit';
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'view',
      access: this.usertype
    };

    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          //console.log(info);
          this.address_name=info.data.a_address;  
          this.city_name = info.data.a_city; 
          this.state_name= info.data.a_state; 
          this.pincode = info.data.a_pincode; 
          this.addresstype= info.data.address_type;
          this.uname= info.data.uname;
          this.mobile_no= info.data.a_mobile; 
          this.landmark= info.data.landmark;
          this.alt_phone= info.data.alternate_number;
          this.gst= info.data.gst;
          this.email_id= info.data.uemail; 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  deleteaddress(addressid){
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'delete',
      access: this.usertype
    };
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.addresslist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }
  
  editaddresspersonal(addressid){
    //console.log(this.addresstype);debugger;
    this.name_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      access:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Personal',
      uaid: addressid,
      address_type: this.addresstype,
      action: 'edit'
    };
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.newaddress='';
          this.addresslist();
          if(info.data.address_id!=''){
            this.deliveryadress='close';
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  editaddressBusiness(addressid){
    this.name_err="";this.gst_err="";this.email_id_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.gst==""){this.gst_err = 'Please enter your gst'; this.token = false; }
    if(this.email_id==""){this.email_id_err = 'Please enter your email'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      access:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      gst:this.gst,
      email:this.email_id,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Business',
      uaid: addressid,
      action: 'edit'
    };
    //console.log(this.data);
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          //console.log('sam');debugger;
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.newaddress='';
          this.addresslist();
          if(info.data.address_id!=''){
            this.deliveryadress='close';
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  changeselectedoption(){
    this.selectedoption = '';
  }

  editpersonalshow(addressid){
    this.selectedoption='Personal';
    this.ordersummaryOpt='close';
    this.deliveryadress='';
    this.newaddress='NewAddress';
    this.action='edit';
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'view',
      access: this.usertype
    };

    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.address_name=info.data.a_address;  
          this.city_name = info.data.a_city; 
          this.state_name= info.data.a_state; 
          this.pincode = info.data.a_pincode; 
          this.addresstype= info.data.address_type;
          this.uname= info.data.uname;
          this.mobile_no= info.data.a_mobile; 
          this.landmark= info.data.landmark;
          this.alt_phone= info.data.alternate_number;
          this.gst= info.data.gst;
          this.email_id= info.data.uemail; 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  editBusinessshow(addressid){
    this.selectedoption='Business';
    this.ordersummaryOpt='close';
    this.deliveryadress='';
    this.newaddress='NewAddress';
    this.action='edit';
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'view',
      access: this.usertype
    };

    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.address_name=info.data.a_address;  
          this.city_name = info.data.a_city; 
          this.state_name= info.data.a_state; 
          this.pincode = info.data.a_pincode; 
          this.addresstype= info.data.address_type;
          this.uname= info.data.uname;
          this.mobile_no= info.data.a_mobile; 
          this.landmark= info.data.landmark;
          this.alt_phone= info.data.alternate_number;
          this.gst= info.data.gst;
          this.email_id= info.data.uemail; 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  /*showsavedaddress(){
    this.addreslist=='';
  }*/

  generatehash(form){
    this.userService.Cartcommand('/generatehash',form)
    .subscribe(
        result => {  
           var info = JSON.parse(JSON.stringify(result)); 
           this.payuform.hash = info.response_message;
           this.hashkey = info.response_message;
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }
}

@Component({
  selector: 'dialog-coupan-applied',
  templateUrl: './dialog-coupan-applied.html',
  styleUrls: ['./checkout.component.scss']
})

export class coupanAppliedPopupDailog {
  constructor( 
    public dialogRef: MatDialogRef<coupanAppliedPopupDailog>,
    public dialog: MatDialog
    ) {} 
    closeNav() {
      document.getElementById("mySidenav").style.cssText = "width: 0px; padding: 0px";
    }
}


//@Component({
  //selector: 'select-radio-type',
  //templateUrl: './checkout.component.html',
  //styleUrls: ['./checkout.component.scss'],
//})
//export class BuytypeRadio {
  //data :any;
  //dialogTitle:string;
  //constructor( public dialog: MatDialog ){}
  //selectedoption: string;
  //buytypes: string[] = ['Business', 'Personnel'];
//}

/*
  editaddress(addressid){
    this.address_name_err="";  this.city_name_err=""; this.state_name_err=""; 
    this.pincode_err=""; this.addresstype_err="";
    this.token=true;
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.addresstype==""){ this.addresstype_err = 'Please choose location'; this.token = false; }
    if(this.token==false) return false;

    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      address_type: this.addresstype,
      action: 'edit',
      access: this.usertype,
      uaid: addressid
    };
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.newaddress='';
          this.addresslist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }
  */

/*
@Component({
  selector: 'dialog-remove-item-confirmation',
  templateUrl: 'dialog-remove-item-confirmation.html',
  styleUrls: ['./checkout.component.scss']

})
export class removeItemConfirmationPopup {
  confirmoption:'';
  constructor(public dialogRef: MatDialogRef<removeItemConfirmationPopup>, public dialog: MatDialog) {} 
    confirmbtn(confm){
      this.confirmoption = confm;
      console.log(this.confirmoption);
    }
}
*/

/*saveaddress(){
    this.addresId='';
    this.address_name_err="";  this.city_name_err=""; this.state_name_err=""; 
    this.pincode_err=""; this.addresstype_err="";this.gstin_err="";this.email_id_err="";
    this.token=true;
    console.log(this.address_name+' -- '+this.city_name);
    if(this.gstin==""){this.gstin_err = 'Please enter GST number'; this.token = false; }
    if(this.email_id==""){this.email_id_err = 'Please enter your Email'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.addresstype==""){ this.addresstype_err = 'Please choose location'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      address_type: this.addresstype
    };
    this.userService.Apicommand('/addNewdeliveradrs',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult));
          this.newaddress='';
          this.addresslist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }*/