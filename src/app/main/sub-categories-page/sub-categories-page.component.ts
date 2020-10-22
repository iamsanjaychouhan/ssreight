import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export interface SubCategories {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sub-categories-page',
  templateUrl: './sub-categories-page.component.html',
  styleUrls: ['./sub-categories-page.component.scss']
})
export class SubCategoriesPageComponent implements OnInit {

  subcategories: SubCategories[] = [
    {value: 'all', viewValue: 'All'},
    {value: '211', viewValue: 'Safety'},
    {value: '213', viewValue: 'Security'}
  ];

  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  results=""; link=''; catid='';
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private userService: UsersService
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
      this.categorylist(this.catid);
  }

  // Brand List
  categorylist(id=''){  
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      catid:id
    };
    // Order list
    this.userService.Apicommand('/categoryListWeb',this.data)
    .subscribe(
        result => {  
            var info = JSON.parse(JSON.stringify(result)); 
            this.results = info.data;
            this.link = info.catlink;
         },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

}
