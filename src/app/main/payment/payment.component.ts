import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  data :any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  todayNumber: number = Date.now();
  payuform:any;
  hashkey='';
  
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.userdata = this.localStorage.getItem('userdata');  
    if(this.userdata!=null){
      let sessdata = JSON.parse(this.userdata); 
      if(sessdata!=='' || sessdata!=='null'){
        this.uids = sessdata.user_id;
      } 
    }
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();

    // this.payuform = {'firstname':'harsh','phone':'7354220530','email':'harshan.shantiinfotech@gmail.com','amount':'1','surl':'http://localhost:4200/payresponse/','furl':'http://localhost:4200/payresponse/','key':'gtKFFx','salt':'eCwWELxi','hash':this.hashkey,'txnid':this.todayNumber,'productinfo':'test product','udf5':'22' }; 

    setTimeout(() => {
      this.generatehash();
      //this.onlineresponse();
    }, 1000);
    

  }

  // Payment Response
  onlineresponse(uaid=''){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids
    };
    
    this.userService.Cartcommand('/paymentresponse',this.data)
    .subscribe(
        result => {  
           var info = JSON.parse(JSON.stringify(result)); 
           console.log(info);
           
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

   // Payment Response
   generatehash(){
        
    this.userService.Cartcommand('/generatehash',this.payuform)
    .subscribe(
        result => {  
           var info = JSON.parse(JSON.stringify(result)); 
           console.log(' ========== '+info.response_message);
           this.payuform.hash = info.response_message;
           this.hashkey = info.response_message;
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  placeorder(){
    // Online payment
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        key: 'rjQUPktU',
        MID: 4934580,
        Salt: 'e5iIg1jwi8',
        surl : "/payment",
        furl : "/payment",
        txnid: this.todayNumber,
        amount:1,
        email: 'harshan@dummy.com',
        phone: '1234567896',
        productinfo: 'Bag',
        CardName: 'Test',
        CardNumber: '5123 4567 8901 2346',
        CVV: 123,
        Expiry: '05/2020'
        
      };

      this.userService.Cartpayment(this.data)
      .subscribe(
          catresult => {  
            var info = JSON.parse(JSON.stringify(catresult)); 
            console.log(info); 
            
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      }); 
    }

    paysubmit(){

    }
    confirmPayment(){
      
    }

}
