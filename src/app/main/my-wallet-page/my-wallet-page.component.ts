import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA, MAT_PAGINATOR_INTL_PROVIDER} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-my-wallet-page',
  templateUrl: './my-wallet-page.component.html',
  styleUrls: ['./my-wallet-page.component.scss']
})
export class MyWalletPageComponent implements OnInit {

  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  results="";  totalamount="";
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private userService: UsersService, public dialog: MatDialog
  ) { }

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
      this.AccessToken = this.userService.GetAccessToken();
      this.walletlist();
  }

  // Wallet List
  walletlist(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids
    };
    // Wallet list
    this.userService.Apicommand('/walletlist',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            console.log(info.data);
            this.results = info.data;
            this.totalamount = info.totalamount;
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }
}
