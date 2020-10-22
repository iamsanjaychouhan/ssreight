import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export interface SubCategories {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-brands-page',
  templateUrl: './brands-page.component.html',
  styleUrls: ['./brands-page.component.scss']
})
export class BrandsPageComponent implements OnInit {
  subcategories: SubCategories[] = [
    {value: 'all-0', viewValue: 'All'},
    {value: 'safety-1', viewValue: 'Safety'},
    {value: 'security-2', viewValue: 'Security'}
  ];
  data:any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0;
  results=""; link='';

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    private userService: UsersService
  ) { }

  ngOnInit() {
    // this.userdata = localStorage.getItem('userdata');  
    //   if(this.userdata!=null){
    //     let sessdata = JSON.parse(this.userdata); 
    //     if(sessdata!=='' || sessdata!=='null'){
    //       this.uids = sessdata.user_id;
    //     } 
    //   }
      this.deviceId = this.userService.generatecookie();
      setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.brandlist();
    }, 100);
     
  }

   // Brand List
   brandlist(){ 
   this.data = {
     device_id:this.deviceId,
     device_type : '2',
     api_key :'Safety%@t$',
     access_token :this.AccessToken,
     filterpage:'yes'
     
   };
   // Order list
   this.userService.Apicommand('/brandList',this.data)
   .subscribe(
       result => {  
           var info = JSON.parse(JSON.stringify(result)); 
           console.log(info);
           this.results = info.data;
           this.link = info.brandlink;
        },
       error => {
         var info=JSON.parse(JSON.stringify(error));
   });
 }

}
