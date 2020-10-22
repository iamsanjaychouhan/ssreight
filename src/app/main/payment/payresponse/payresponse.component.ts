import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../../_service';

@Component({
  selector: 'app-payresponse',
  templateUrl: './payresponse.component.html',
  styleUrls: ['./payresponse.component.scss']
})
export class PayresponseComponent implements OnInit {

  data :any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  todayNumber: number = Date.now();
  payuform:any;
  hashkey='';
  constructor(
    private userService: UsersService,
    private alertService: AlertService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
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

}
