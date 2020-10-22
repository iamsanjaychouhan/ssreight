import { Component, OnInit } from '@angular/core';
import { AlertService, UsersService } from '../../../_service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  data :any;
  deviceId = ''; AccessToken = '';
  results =[]; link:any;
  userdata=''; uids=0;
  pagetitle='';
  description='';

  constructor(
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.deviceId = this.userService.generatecookie();
    setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.specificpage();
   }, 100);
    
  }

  specificpage(){
    // Set Common Data
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      pageid:3
    };

    // Get Page List
    this.userService.Apicommand('/specificpage',this.data)
    .subscribe(
      data => {  
          var info = JSON.parse(JSON.stringify(data)); 
          console.log(info);
          this.pagetitle = info.data.title;
          this.description = info.data.description;
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });

  }
}
