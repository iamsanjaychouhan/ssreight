import { Component, OnInit, Inject } from '@angular/core';
import { AlertService, UsersService } from '../../../_service';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {ActivatedRoute, Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data :any;
  reservationNumber = '';
  form_submit_err ='';
  deviceId = ''; AccessToken = '';
  results :any; link:any; 
  brandresults :any; Brandlink:any;
  emailsubscrib_err='';
  emailsubscrib='';
  emailsubscrib_success='';
  types='';
  emailrefer_err='';
  emailrefer_success='';
  emailrefer='';
  sitetypeval='';
  sitetype=false;
  bannerlist = "";
  bannerlink = "";  
  homebannerlist = "";
  homebannerlink = "";
  dealerbannerlist = "";
  dealerbannerlink = "";  
  userdata = '';
  session : any;
  uids = '';
  private activatedRouteSubscription:Subscription;
  private cookieValue: string;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private http:HttpClient,
    private userService: UsersService,
    private alertService: AlertService,
    private cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      }
    },
    nav: true
  }
  slidesStore: any[];
  ngOnInit() { 
    this.sitetypeval = this.localStorage.getItem('sitetype'); 
    if(this.sitetypeval=='true'){
      this.router.navigate(['/service']);
      this.sitetype= true;
    } 
    this.userdata = this.localStorage.getItem('userdata');
    if(this.userdata)
      this.session = JSON.parse(this.userdata);
    else
      this.session = '';
    this.userdata = this.localStorage.getItem('userdata');
    if(this.userdata!=null){
      let sessdata = JSON.parse(this.userdata); 
      if(sessdata!=='' || sessdata!=='null') this.uids = sessdata.user_id;
    }
    this.deviceId = this.userService.generatecookie();
    setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.homelist();
      this.brandlist();
      this.BannerList();
      this.Homebannerlist();
      this.Dealerbannerlist();
    }, 2000);
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  // Home List
  homelist(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken      
    };
    this.userService.Apicommand('/homelist',this.data)
    .subscribe(
        result => {  
          this.results = result['data'];
          this.link = result['catlink'];
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  // Brand list
  brandlist(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken      
    };
    this.userService.Apicommand('/brandList',this.data)
    .subscribe(
        brandresult => {  
          this.brandresults = brandresult['data'];
          //console.log(this.brandresults);
          this.Brandlink = brandresult['brandlink'];
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  // Subscribe
  subscribe(){
    this.emailsubscrib_err=''; this.emailsubscrib_success='';
    if(this.emailsubscrib==''){
      this.emailsubscrib_err = 'Please enter your email address'; return false; 
    }
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      email_id: this.emailsubscrib,
      types: 'subscribe'
    };
    this.userService.Apicommand('/subscribe',this.data)
    .subscribe(
        subscribresult => {  
          var infos = JSON.parse(JSON.stringify(subscribresult));  
          this.emailsubscrib='';       
          if(infos.status==0)
            this.emailsubscrib_err = infos.response_message;
          else
            this.emailsubscrib_success = infos.response_message;
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  // Refer a friend
  referfriend(){
    this.emailrefer_err=''; this.emailrefer_success='';
    if(this.emailrefer==''){
      this.emailrefer_err = 'Please enter your email address'; return false; 
    }
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      email_id: this.emailrefer,
      types: 'refer'
    };
    this.userService.Apicommand('/subscribe',this.data)
    .subscribe(
        referresult => {  
          var infos = JSON.parse(JSON.stringify(referresult));  
          this.emailrefer='';       
          if(infos.status==0)
            this.emailrefer_err = infos.response_message;
          else
            this.emailrefer_success = infos.response_message;
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  // Banner List
  BannerList(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken      
    };
    this.userService.Apicommand('/bannerlist',this.data)
    .subscribe(
        result => {   
          this.bannerlist = result['data'];
          this.bannerlink = result['Banner_Link'];
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }
  
  // HomeBanner List
  Homebannerlist(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken      
    };
    this.userService.Apicommand('/homebannerlist',this.data)
    .subscribe(
        result => {   
          this.homebannerlist = result['data'];
          this.homebannerlink = result['Home_Banner_Link'];
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  //created code for dealer banner list
  Dealerbannerlist(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken      
    };
    this.userService.Apicommand('/dealerbannerlist',this.data)
    .subscribe(
        result => {   
          this.dealerbannerlist = result['data'];
          this.dealerbannerlink = result['Home_Banner_Link'];
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }
  //created code end here
}

