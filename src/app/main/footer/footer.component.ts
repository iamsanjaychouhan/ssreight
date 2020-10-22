import { Component, OnInit } from '@angular/core';
import { AlertService, UsersService } from '../../../_service';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	data :any;deviceId = '';AccessToken = '';results :any;link:any;brandresults :any; Brandlink:any;parent_category:'string';category:'string';cid:any;category_id;
	private activatedRouteSubscription:Subscription;
  	constructor(
  		private http:HttpClient,
		private userService: UsersService,
		private alertService: AlertService,
		private cookieService: CookieService,
		private router: Router
  	) { }
  	ngOnInit() {
	  	this.deviceId = this.userService.generatecookie();
	    setTimeout (() => {
			this.AccessToken = this.userService.GetAccessToken();
			this.homelist();
			this.brandlist();
	    }, 2000);
  	}
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
  	brandlist(){
	    this.data = {
			device_id:this.deviceId,
			device_type : '2',
			api_key :'Safety%@t$',
			access_token :this.AccessToken,
			filterpage:'yes'      
	    };
	    this.userService.Apicommand('/brandList',this.data)
	    .subscribe(
	        brandresult => {  
				this.brandresults = brandresult['data'];
				this.Brandlink = brandresult['brandlink'];
	        },
	        error => {
	          var info=JSON.parse(JSON.stringify(error));
	    }); 
  	}  
  	reload(parent_category,category,category_id){
  		//location.reload();
  		//this.router.navigate(['/product', 'parent_category', 'category', this.category_id]);
  		//this.router.navigateByUrl('/product', { 'parent_category':'','category':'category','cid':this.category_id });
  		//this.router.navigate(['/product', { queryParams: {'parent_category':'parent_category', 'category':'category', 'cid':this.category_id}}])
  	}	

}
