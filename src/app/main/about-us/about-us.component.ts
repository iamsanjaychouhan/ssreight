import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  data :any;
  deviceId = ''; AccessToken = '';
  results =[]; link:any;
  userdata=''; uids=0;

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
      if(sessdata!=='' || sessdata!=='null') this.uids = sessdata.user_id;
    }
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
  }

  specificpage(){
      // Set Common Data
      this.data = {
        device_id:this.deviceId,
        device_type : '2',
        api_key :'Safety%@t$',
        access_token :this.AccessToken,
        uid: this.uids,
        pageid:'9'
      };
      // Get Category List
      this.userService.Apicommand('/specificpage',this.data)
      .subscribe(
        data => {  
            var info = JSON.parse(JSON.stringify(data)); 
            console.log(info);
          },
          error => {
            var info=JSON.parse(JSON.stringify(error));
      });
  }

}
