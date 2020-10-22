import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig,MatTableDataSource} from "@angular/material";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, Validators} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  panelOpenState = false;
  data :any;
  deviceId = ''; AccessToken = '';
  results :any; link:any;  userdata=''; 
  session:any;
  product_id=0; uids=0; review=''; similarproduct='';
  sizeOfProduct=[];colorOfProduct=[];dealerqtypriceOfProduct='';taxOfProduct:any;size_value;
  available='string';uid;uaid;senduid;senduaid;
  private activatedRouteSubscription:Subscription;
  pid:any; catname:any;
  userimgLink="";
  cartcount="";
  submitted = false;
  token = true;
  pincode='';
  pincode_err='';
  confirmoption='';
  totalprice:''; 
  totaltax="";
  subtotal="";
  quantitys=0;
  result:any;
  quantity=1;
  resultscart = '';
  qtyerr=""; errId=""; coupons=""; coupommessage=""; 
  coupondiscount=""; couponid=""; couponcode="";     
  shippingPrice="";
  public moq: any;
  strqty;endqty;dealerprice;finalqtyprice;updatedqty;productpricewithgst;taxwithgst:any;pregst;totalamnt;basicprise;radiogroup;strq;endq;size;postedsize;size_err;postedcolorname;postedcolorcode;color;colorcode;color_err;sizecolor_err;newpincode;pincode_succ;amount_err;usertype;customernumber;product_image;product_name;brand_name;product_dprice;product_price;percent;product_ldescription;color_name:'string';
  
  constructor(public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router:Router,
    private toastr: ToastrService
      ) {}      
    productSlider: OwlOptions = { 
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: false,
      autoplay: true,
      navSpeed: 500,
      navText: ['', ''],
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 4
        },
        992: {
          items: 6
        },
        1200: {
          items: 6
        }
      },
      nav: false
    }

  ngOnInit(){
        let moq;
        this.userdata = localStorage.getItem('userdata');
        if(this.userdata){
          this.session = JSON.parse(this.userdata);
        }
        else{
          this.session = '';
        }
        this.userdata = localStorage.getItem('userdata');
        if(this.userdata!=null){
          let sessdata = JSON.parse(this.userdata);
          if(sessdata !=='' || sessdata !=='null')
          {
            this.uids = sessdata.user_id;this.usertype = sessdata.user_type;
          }
        }
        this.deviceId = this.userService.generatecookie();
        this.AccessToken = this.userService.GetAccessToken();
        this.cartlist();
        this.productdetail();
        this.getpincode();
        this.customercare();
        this.result = {'quantity' : 1};

  }
  productdetail(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uids: this.uids    
    };
    this.activatedRouteSubscription = this.activatedRoute.params
    .subscribe(
        (p) =>{
          let params: any = p;
          this.pid = params['pid'];
        },
      (err) =>{
        console.error(err);
      });  
    this.data.product_id = this.pid;
    this.userService.Apicommand('/productdetails',this.data)
      .subscribe(
          result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            this.results = info.data;
            this.link = info.product_img_link;
            this.review = info.revewList;
            this.similarproduct = info.similarproduct;
            this.catname = info.catname;
            this.userimgLink = info.userImgLink;
            this.sizeOfProduct = info.sizeOfProduct;
            this.colorOfProduct = info.colorOfProduct;
            this.dealerqtypriceOfProduct = info.dealerqtypriceOfProduct;
            this.taxOfProduct= info.taxOfProduct.value;
            this.productpricewithgst= info.productpricewithgst;
            this.moq = this.results.moq;
            this.product_image = this.results.product_image;
            this.product_name = this.results.product_name;
            this.brand_name = this.results.brand_name;
            this.product_dprice = this.results.product_dprice;
            this.product_price = this.results.product_price;
            this.percent= this.results.percent;
            this.product_ldescription = this.results.product_ldescription;
            
            if(this.usertype == 'company'){
              if(this.dealerqtypriceOfProduct[0]['qty_one_start'] !='' && this.dealerqtypriceOfProduct[0]['qty_one_start'] !='null' && this.dealerqtypriceOfProduct[0]['dealer_price_one'] !='' && this.dealerqtypriceOfProduct[0]['dealer_price_one'] !='null'){
                this.result.quantity = this.dealerqtypriceOfProduct[0]['qty_one_start'];
                this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_one'];
                this.pregst = this.basicprise * this.result.quantity;
                this.taxwithgst = (this.pregst*this.taxOfProduct/100).toFixed();
                this.totalamnt = (this.pregst+(this.pregst*this.taxOfProduct/100)).toFixed();
              }
            }else{
              this.result.quantity = 1;
              this.basicprise = this.product_dprice;
              this.taxwithgst = info.taxwithgst;
              this.pregst = this.results.product_dprice * this.result.quantity;
              this.totalamnt = (this.pregst+(this.pregst*this.taxOfProduct/100)).toFixed();
            }

          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
    });
  }
  onSelectionChange(strqty,endqty,dealerprice) {
    this.finalqtyprice = this.strqty*this.dealerprice;
    if(this.result.quantity != '0'){
      this.result.quantity = strqty;
      this.basicprise = dealerprice;
      this.pregst = this.basicprise * this.result.quantity;
      this.taxwithgst = (this.pregst*this.taxOfProduct/100).toFixed();
      this.totalamnt = (this.pregst+(this.pregst*this.taxOfProduct/100)).toFixed();
      const newstrqty = strqty;
      localStorage.removeItem('strqty');
      localStorage.setItem('strqty',newstrqty);
      this.strq = localStorage.getItem('strqty');
      const newendqty = endqty;
      localStorage.removeItem('endqty');
      localStorage.setItem('endqty',newendqty);
      this.endq = localStorage.getItem('endqty');
    }
  }
  onSelectionChangeInput(productid,quantity,basicprise,gstonprdct) {
    if(quantity>0)
    { 
      //for customer and without login usertype
      quantity=parseInt(quantity);
      this.result.quantity = quantity;
      this.pregst = basicprise * this.result.quantity;
      this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
      this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
      //created code for range for company|dealer
      if(this.dealerqtypriceOfProduct[0] !='' && this.usertype == 'company'){
        if((this.result.quantity) >= (this.dealerqtypriceOfProduct[0]['qty_one_start']) && (this.result.quantity) <= (this.dealerqtypriceOfProduct[0]['qty_one_end'])){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_one'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_two_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_two_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_two'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_three_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_three_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_three'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_four_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_four_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_four'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_five_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_five_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_five'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else{
          this.basicprise = basicprise;
          this.quantity = this.result.quantity;
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }
      }
      //created code end here
    }
  }
  minus(productid,quantity,basicprise,gstonprdct){
    //console.log(this.usertype);
    if(quantity>0)
    { 
      //for customer and without login user
      quantity=parseInt(quantity);
      //console.log(quantity);
      if(quantity != 1){
        this.result.quantity = quantity-1;
      }
      //console.log(this.result.quantity);
      this.pregst = basicprise * this.result.quantity;
      this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
      this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
      //created code for range for company|dealer
      if(this.dealerqtypriceOfProduct[0] !='' && this.usertype == 'company'){
        if((this.result.quantity) >= (this.dealerqtypriceOfProduct[0]['qty_one_start']) && (this.result.quantity) <= (this.dealerqtypriceOfProduct[0]['qty_one_end'])){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_one'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_two_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_two_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_two'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_three_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_three_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_three'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_four_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_four_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_four'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_five_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_five_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_five'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else{
          this.basicprise = basicprise;
          this.quantity = this.result.quantity;
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }
      }
      //created code end here
    }
  }
  plus(productid,quantity,basicprise,gstonprdct){
    if(quantity>0)
    { 
      //for customer and without login
      quantity=parseInt(quantity);
      this.result.quantity = quantity+1;
      this.pregst = basicprise * this.result.quantity;
      this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
      this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
      //created code for range for company|dealer
      if(this.dealerqtypriceOfProduct[0] !='' && this.usertype == 'company' ){
        if((this.result.quantity) >= (this.dealerqtypriceOfProduct[0]['qty_one_start']) && (this.result.quantity) <= (this.dealerqtypriceOfProduct[0]['qty_one_end'])){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_one'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_two_start'] && this.result.quantity <=this.dealerqtypriceOfProduct[0]['qty_two_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_two'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_three_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_three_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_three'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_four_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_four_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_four'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else if(this.result.quantity >= this.dealerqtypriceOfProduct[0]['qty_five_start'] && this.result.quantity <= this.dealerqtypriceOfProduct[0]['qty_five_end']){
          this.quantity = this.result.quantity;
          this.basicprise = this.dealerqtypriceOfProduct[0]['dealer_price_five'];
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }else{
          this.basicprise = basicprise;
          this.quantity = this.result.quantity;
          this.pregst = this.basicprise * this.result.quantity;
          this.taxwithgst = (this.pregst*gstonprdct/100).toFixed();
          this.totalamnt = (this.pregst+(this.pregst*gstonprdct /100)).toFixed();
        }
      }
      //created code end here
    }
  }
  onsizechange(postedsized){
    let postedsize = postedsized;
    this.size = postedsize;
  };
  oncolorchange(postedcolorname,postedcolorcode){
    let color = postedcolorname;
    let colorcode = postedcolorcode;
    this.color = color;
    this.colorcode = colorcode;
  };
  addtocart(pid,qty){
    if(this.totalamnt < 999999){
      this.newpincode = localStorage.getItem('newpincode');
      if(this.pincode !='' && this.pincode != null && this.newpincode){
        if((this.sizeOfProduct[0]['fk_size_id'] != '' && this.sizeOfProduct[0]['fk_size_id'] != null) && (this.colorOfProduct[0]['fk_color_id'] != '' && this.colorOfProduct[0]['fk_color_id'] != null) ){
            if((this.size!='' && this.size != null) && (this.color != '' && this.color != null) ){
              this.data = {
                device_id:this.deviceId,
                device_type : '2',
                api_key :'Safety%@t$',
                access_token :this.AccessToken,
                uid: this.uids,
                product_id:pid,
                quantity:qty,
                size:this.size,
                color:this.color,
                basicprise : this.basicprise
              };     
              this.userService.Cartcommand('/addtoCart',this.data)
              .subscribe(
                  catresult => {  
                    var info = JSON.parse(JSON.stringify(catresult)); 
                    const cartcounts = info.cartcount;
                    localStorage.removeItem('cartcount');
                    localStorage.setItem('cartcount',cartcounts);
                    this.cartcount = localStorage.getItem('cartcount');
                    if(info.status == '1'){
                      this.toastr.success('Product added to cart');
                    }else{
                      this.toastr.error(info.response_message);
                    }
                  },
                  error => {
                    var info=JSON.parse(JSON.stringify(error));
              });
            }else if((this.size!='' && this.size != null)){
              this.color_err = 'Please choose color';
            }else if(this.color != '' && this.color != null){
              this.size_err = 'Please choose size';
            }
            else{
              this.sizecolor_err = 'Please choose size and color';
            }
        }
        else if(this.sizeOfProduct[0]['fk_size_id'] != '' && this.sizeOfProduct[0]['fk_size_id'] != null)
        { 
          if(this.size!='' && this.size != null){
              this.data = {
                device_id:this.deviceId,
                device_type : '2',
                api_key :'Safety%@t$',
                access_token :this.AccessToken,
                uid: this.uids,
                product_id:pid,
                quantity:qty,
                size:this.size,
                color:this.color,
                basicprise : this.basicprise
              };      
              this.userService.Cartcommand('/addtoCart',this.data)
              .subscribe(
                  catresult => {  
                    var info = JSON.parse(JSON.stringify(catresult)); 
                    const cartcounts = info.cartcount;
                    localStorage.removeItem('cartcount');
                    localStorage.setItem('cartcount',cartcounts);
                    this.cartcount = localStorage.getItem('cartcount');
                    if(info.status == '1'){
                      this.toastr.success('Product added to cart');
                    }else{
                      this.toastr.error(info.response_message);
                    }
                  },
                  error => {
                    var info=JSON.parse(JSON.stringify(error));
              });
          }else{
            this.size_err = 'Please choose size';
          }
        }else if(this.colorOfProduct[0]['fk_color_id'] != '' && this.colorOfProduct[0]['fk_color_id'] != null)
        { 
          if(this.color !='' && this.color != null){
            this.data = {
              device_id:this.deviceId,
              device_type : '2',
              api_key :'Safety%@t$',
              access_token :this.AccessToken,
              uid: this.uids,
              product_id:pid,
              quantity:qty,
              size:this.size,
              color:this.color,
              basicprise : this.basicprise
            };      
            this.userService.Cartcommand('/addtoCart',this.data)
            .subscribe(
                catresult => {  
                  var info = JSON.parse(JSON.stringify(catresult)); 
                  const cartcounts = info.cartcount;
                  localStorage.removeItem('cartcount');
                  localStorage.setItem('cartcount',cartcounts);
                  this.cartcount = localStorage.getItem('cartcount');
                    if(info.status == '1'){
                      this.toastr.success('Product added to cart');
                    }else{
                      this.toastr.error(info.response_message);
                    }
                },
                error => {
                  var info=JSON.parse(JSON.stringify(error));
            });
          }else{
            this.color_err = 'Please choose color';
          }
        }
        else{
          this.data = {
            device_id:this.deviceId,
            device_type : '2',
            api_key :'Safety%@t$',
            access_token :this.AccessToken,
            uid: this.uids,
            product_id:pid,
            quantity:qty,
            size:this.size,
            color:this.color,
            basicprise : this.basicprise
          };    
          this.userService.Cartcommand('/addtoCart',this.data)
          .subscribe(
              catresult => {  
                var info = JSON.parse(JSON.stringify(catresult)); 
                const cartcounts = info.cartcount;
                localStorage.removeItem('cartcount');
                localStorage.setItem('cartcount',cartcounts);
                this.cartcount = localStorage.getItem('cartcount');
                if(info.status == '1'){
                  this.toastr.success('Product added to cart');
                }else{
                  this.toastr.error(info.response_message);
                }
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
          });
        }
      }else{
        this.pincode_err = 'Please check your pincode for availablity';
      }
    }else{
      this.amount_err = 'Amount should be less than 10,00000';
    }  
  }
  // Cart List
  buynow(pid,qty){
    this.newpincode = localStorage.getItem('newpincode');
    if(this.pincode !='' && this.pincode != null && this.newpincode){
      if((this.sizeOfProduct[0]['fk_size_id'] != '' && this.sizeOfProduct[0]['fk_size_id'] != null) && (this.colorOfProduct[0]['fk_color_id'] != '' && this.colorOfProduct[0]['fk_color_id'] != null) ){
          if((this.size!='' && this.size != null) && (this.color != '' && this.color != null) ){
            this.data = {
              device_id:this.deviceId,
              device_type : '2',
              api_key :'Safety%@t$',
              access_token :this.AccessToken,
              uid: this.uids,
              product_id:pid,
              quantity:qty,
              size:this.size,
              color:this.color
            };      
            this.userService.Cartcommand('/addtoCart',this.data)
            .subscribe(
                catresult => {  
                  var info = JSON.parse(JSON.stringify(catresult)); 
                  const cartcounts = info.cartcount;
                  localStorage.removeItem('cartcount');
                  localStorage.setItem('cartcount',cartcounts);
                  this.cartcount = localStorage.getItem('cartcount');
                  this.router.navigate(['/checkout']);
                  //location.reload();
                },
                error => {
                  var info=JSON.parse(JSON.stringify(error));
            });
          }else if((this.size!='' && this.size != null)){
            this.color_err = 'Please choose color';
          }else if(this.color != '' && this.color != null){
            this.size_err = 'Please choose size';
          }
          else{
            this.sizecolor_err = 'Please choose size and color';
          }
      }
      else if(this.sizeOfProduct[0]['fk_size_id'] != '' && this.sizeOfProduct[0]['fk_size_id'] != null)
      { 
        if(this.size!='' && this.size != null){
            this.data = {
              device_id:this.deviceId,
              device_type : '2',
              api_key :'Safety%@t$',
              access_token :this.AccessToken,
              uid: this.uids,
              product_id:pid,
              quantity:qty,
              size:this.size,
              color:this.color
            };      
            this.userService.Cartcommand('/addtoCart',this.data)
            .subscribe(
                catresult => {  
                  var info = JSON.parse(JSON.stringify(catresult)); 
                  const cartcounts = info.cartcount;
                  localStorage.removeItem('cartcount');
                  localStorage.setItem('cartcount',cartcounts);
                  this.cartcount = localStorage.getItem('cartcount');
                  this.router.navigate(['/checkout']);
                  //location.reload();
                },
                error => {
                  var info=JSON.parse(JSON.stringify(error));
            });
        }else{
          this.size_err = 'Please choose size';
        }
      }else if(this.colorOfProduct[0]['fk_color_id'] != '' && this.colorOfProduct[0]['fk_color_id'] != null)
      { 
        if(this.color !='' && this.color != null){
          this.data = {
            device_id:this.deviceId,
            device_type : '2',
            api_key :'Safety%@t$',
            access_token :this.AccessToken,
            uid: this.uids,
            product_id:pid,
            quantity:qty,
            size:this.size,
            color:this.color
          };      
          this.userService.Cartcommand('/addtoCart',this.data)
          .subscribe(
              catresult => {  
                var info = JSON.parse(JSON.stringify(catresult)); 
                const cartcounts = info.cartcount;
                localStorage.removeItem('cartcount');
                localStorage.setItem('cartcount',cartcounts);
                this.cartcount = localStorage.getItem('cartcount');
                this.router.navigate(['/checkout']);
                //location.reload();
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
          });
        }else{
          this.color_err = 'Please choose color';
        }
      }
      else{
        this.data = {
          device_id:this.deviceId,
          device_type : '2',
          api_key :'Safety%@t$',
          access_token :this.AccessToken,
          uid: this.uids,
          product_id:pid,
          quantity:qty,
          size:this.size,
          color:this.color
        };    
        //console.log(this.data);debugger;  
        this.userService.Cartcommand('/addtoCart',this.data)
        .subscribe(
            catresult => {  
              var info = JSON.parse(JSON.stringify(catresult)); 
              const cartcounts = info.cartcount;
              localStorage.removeItem('cartcount');
              localStorage.setItem('cartcount',cartcounts);
              this.cartcount = localStorage.getItem('cartcount');
              this.router.navigate(['/checkout']);
              //location.reload();
            },
            error => {
              var info=JSON.parse(JSON.stringify(error));
        });
      }
    }else{
      this.pincode_err = 'Please check your pincode for availablity';
    }  
  }

  cartlist(){
    this.newpincode = localStorage.getItem('newpincode');
    //console.log(this.newpincode);debugger;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      pincode: this.newpincode
    };  
    //console.log(this.data);debugger;  
    this.userService.Cartcommand('/listCart',this.data)
    .subscribe(
      catresult => {  
        var info = JSON.parse(JSON.stringify(catresult)); 
        this.resultscart = info.data;
        this.link = info.product_img_link;
        this.totalprice = info.total_price;
        this.totaltax = info.totaltax;
        this.subtotal = info.subtotal;
        this.shippingPrice = info.shipping;
        const cartcounts = info.cartcount;
        localStorage.removeItem('cartcount');
        localStorage.setItem('cartcount',cartcounts);
        this.cartcount = localStorage.getItem('cartcount');
          if(info.cartRow!=null && info.cartRow.discount!=0.00)
            this.coupondiscount = info.cartRow.discount;
          else 
            this.coupondiscount = "";
          if(info.cartRow!=null && info.cartRow.promo_code_id>0)
            this.couponid = info.cartRow.promo_code_id;
          else 
            this.couponid="";
          if(info.couponcode.coupon_code!="")
            this.couponcode = info.couponcode.coupon_code;
          else 
            this.couponcode="";
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
  
  //created code end here
  onSubmit() {
    this.submitted = true;
    this.pincode_err = '';
    this.token = true;        
    if(this.pincode=="")
    { 
      this.pincode_err = 'Please enter your pincode'; this.token = false;
    }
    let sessdata = JSON.parse(this.userdata);
    if(sessdata !='' && sessdata !='null' && sessdata != null){
      this.uid = sessdata.user_id;
      this.uaid = sessdata.uaid;
    }else{
      this.uid = '';
      this.uaid = '';
    }
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      pincode:this.pincode,
      senduid:this.uid,
      senduaid:this.uaid
    };
    this.userService.Apicommand('/checkpincode',this.data)
    .subscribe(
        data =>{  
          var info = JSON.parse(JSON.stringify(data));
          if(info.available==true){
            this.pincode = info.data['pincode'];
            const newpincode = this.pincode;
            localStorage.removeItem('newpincode');
            localStorage.setItem('newpincode',newpincode);
            this.pincode_succ = 'Delivery to this pincode is available';  
          }else{
            this.pincode_err = 'Delivery to this pincode is not available';
          }
        },
      error => {
        var info=JSON.parse(JSON.stringify(error));
    });        
  }     

  getpincode() {
    let sessdata = JSON.parse(this.userdata);
    if(sessdata !='' && sessdata !='null' && sessdata != null){
      this.uid = sessdata.user_id;
      this.uaid = sessdata.uaid;
    }else{
      this.uid = '';
      this.uaid = '';
    }
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      senduid:this.uid,
      senduaid:this.uaid
    };
    this.userService.Apicommand('/getpincode',this.data)
    .subscribe(
        data =>{  
          var info = JSON.parse(JSON.stringify(data));
          if(info.available==true){
            this.pincode = info.data['a_pincode'];
          }
        },
      error => {
        var info=JSON.parse(JSON.stringify(error));
    });        
  }
  // product detail page
  customercare(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken
    };
    this.userService.Apicommand('/customercareno',this.data)
    .subscribe(
        data =>{  
          var info = JSON.parse(JSON.stringify(data));
         this.customernumber = info.data;
        },
      error => {
        var info=JSON.parse(JSON.stringify(error));
    });        
  }
  



  openCompareDialog() {
    const dialogRef = this.dialog.open(ComparePopup,{
      panelClass: 'custom-modalbox'
      });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCompareDialogDialog() {
    const dialogRef = this.dialog.open(ViewShippingDetailDialog,{
      width: '80%',
      height: '74%'
      }      
      );
    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`Dialog result: ${result}`);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ViewShippingDetailDialog,{
      width: '80%',
      height: '74%'
      }      
      );
    dialogRef.afterClosed().subscribe(result => { 
      console.log(`Dialog result: ${result}`);
    });
  }

  openCallbackDialog() {
    const dialogRef = this.dialog.open(CallBackPopup);
    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEasyReturnDialog() {
    const dialogRef = this.dialog.open(EasyReturnPopup);
    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`Dialog result: ${result}`);
    });
  }

  openShareDialog() {
    const dialogRef = this.dialog.open(SharePopup);
    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`Dialog result: ${result}`);
    });
  }

  openOfferDialog() {
    const dialogRef = this.dialog.open(OfferPopup);
    dialogRef.afterClosed().subscribe(result => { 
      //console.log(`Dialog result: ${result}`);
    });
  }

  sizeColorPopup() {
    const dialogRef = this.dialog.open(SizeColorPopup,{
        data: { name: this.sizeOfProduct}
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  instllationPopup() {
    const dialogRef = this.dialog.open(ProductInstallationPopup);
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'product-size-color-popup',
  templateUrl: 'product-size-color-popup.html',
  styleUrls: ['./product-detail.component.scss']

})
export class SizeColorPopup {
  data :any;
  dialogTitle:string;
  constructor( 
    public dialogRef: MatDialogRef<SizeColorPopup>,
    public dialog: MatDialog
    ) 
    {
      
    } 
}
@Component({
  selector: 'product-installation-popup',
  templateUrl: 'product-installation-popup.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductInstallationPopup {
  constructor( 
    public dialogRef: MatDialogRef<ProductInstallationPopup>,
    public dialog: MatDialog
    ) {}   
}
@Component({
  selector: 'add-compare-product',
  templateUrl: 'add-compare-product.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ComparePopup {
  constructor(public dialogRef: MatDialogRef<ComparePopup>, public dialog: MatDialog) {}
  openCompareDialog(){
    const dialogRef = this.dialog.open(ComparePopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
}
@Component({
  selector: 'call-back-popup',
  templateUrl: 'call-back-popup.html',
  styleUrls: ['./product-detail.component.scss']
})
export class CallBackPopup {
  data: any;
  deviceId = ''; AccessToken = '';
  bulkbuy_phone = "";
  bulkbuy_phone_err = "";
  token = true; success = '';
  constructor(
    public dialogRef: MatDialogRef<CallBackPopup>,
    public dialog: MatDialog,
    private http: HttpClient,
    private userService: UsersService
  ) { }
  openCallbackDialog(){
    const dialogRef = this.dialog.open(CallBackPopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
  onSubmit() {
    this.bulkbuy_phone_err = '';
    this.token = true;
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    if (this.bulkbuy_phone == "") { this.bulkbuy_phone_err = 'Please enter your number'; this.token = false; }
    if (this.token == false) return false;
    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      bulkbuy_phone: this.bulkbuy_phone
    };
    this.userService.Apicommand('/bulkbuy_callback', this.data)
      .subscribe(
        data => {
            var info = JSON.parse(JSON.stringify(data));
            if (info.response_message=="success")
            {
              const dialogRef = this.dialog.open(SuccessfullCallBackPopup);
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
              setTimeout(() => { this.dialogRef.close(); }, 100);
            }
            else {
        this.bulkbuy_phone_err = 'Something went wrong';
            }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
}

@Component({
  selector: 'view-shipping-detail-dialog',
  templateUrl: 'view-shipping-detail-dialog.html',
  styleUrls: ['product-detail.component.scss'],
})
export class ViewShippingDetailDialog {}
@Component({
  selector: 'easy-return-popup',
  templateUrl: 'easy-return-popup.html',
  styleUrls: ['./product-detail.component.scss']
})
export class EasyReturnPopup {
  constructor(public dialogRef: MatDialogRef<EasyReturnPopup>, public dialog: MatDialog) {}
  openEasyReturnDialog(){
    const dialogRef = this.dialog.open(EasyReturnPopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
}
@Component({
  selector: 'share-popup',
  templateUrl: 'product-share.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class SharePopup {
  constructor(public dialogRef: MatDialogRef<SharePopup>, public dialog: MatDialog) {}
   openShareDialog(){
    const dialogRef = this.dialog.open(SharePopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
}
@Component({
  selector: 'Offer-popup',
  templateUrl: 'offer-popup.html',
  styleUrls: ['./product-detail.component.scss']
})
export class OfferPopup {
  panelOpenState:any;
  constructor(public dialogRef: MatDialogRef<OfferPopup>, public dialog: MatDialog) {}
   openOfferDialog(){
    const dialogRef = this.dialog.open(OfferPopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
}

@Component({
  selector: 'successfull-callback-popup',
  templateUrl: 'successfull-callback-popup.html',
  styleUrls: ['./product-detail.component.scss']
})
export class SuccessfullCallBackPopup {
  constructor(public dialogRef: MatDialogRef<SuccessfullCallBackPopup>, public dialog: MatDialog) {}
  openDealerDialog(){
    const dialogRef = this.dialog.open(SuccessfullCallBackPopup);
    dialogRef.afterClosed().subscribe(result => {});
  }
}


