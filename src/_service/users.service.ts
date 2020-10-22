import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public BaseUrl = "https://safetywagon.com/safetywagon_admin/assets/uploads/";
  private Access_API= "https://safetywagon.com/safetywagon_backend/user/generate_access_token/";
  private REG_API= "https://safetywagon.com/safetywagon_backend/user/register/";
  private LOGIN_API= "https://safetywagon.com/safetywagon_backend/user/login/";
  private HOMECAT_API= "https://safetywagon.com/safetywagon_backend/api/homeList/";
  private COMMON_API= "https://safetywagon.com/safetywagon_backend/api";
  private USERCOMMON_API= "https://safetywagon.com/safetywagon_backend/user";
  private CARTCOMMON_API= "https://safetywagon.com/safetywagon_backend/cart";
  private SERVICECOMMON_API= "https://safetywagon.com/safetywagon_backend/service";

  deviceId = '';
  jsonkey = '';
  private cookieValue: string;
  private cookieValueAccess: string;

  constructor(private http: HttpClient,
    private cookieService: CookieService
    ) { }

  accesstoken(data) {
    const formData = new FormData();
    formData.append("command", JSON.stringify(data));
    return this.http.post(this.Access_API,formData,{headers:{} })
    //  return this.http.post(this.Access_API,JSON.stringify(data),{ headers: {'Content-Type': 'application/json','auth-token':'c57e0f79-31cb-4ca5-9781-6993d3741058',"Access-Control-Allow-Origin":"*"}  });
  }
  register(data) {
    const formData = new FormData();
    formData.append("command", JSON.stringify(data));
    return this.http.post(this.REG_API,formData,{ headers: {}  });
  }

  login(data){
      const formData = new FormData();
      formData.append("command", JSON.stringify(data));
      return this.http.post(this.LOGIN_API,formData,{ headers: {} });
  }

  generatecookie(){   
    this.cookieValue = this.cookieService.get('device_id');
   // this.cookieValueAccess = this.cookieService.get('access_token');
    let result = Math.floor(Math.random() * Math.pow(10, 15));
    //let accessT = Math.floor(Math.random() * Math.pow(10, 25));
    if(this.cookieValue==''){
      this.cookieService.set('device_id',result.toString());
      //this.cookieService.set('access_token',accessT.toString());
      let jsondata = result.toString();
      return jsondata;
    }
    else{
      let jsondata = this.cookieValue;
      return jsondata;
    }   
  }

  GenerateAccessToken(AccessToken){
    this.cookieService.set('access_token',AccessToken);
    return AccessToken;
  }
  GetAccessToken(){
    return this.cookieService.get('access_token');
  }

  Apicommand(url,data){
    const formData = new FormData();
    formData.append("command", JSON.stringify(data));
    return this.http.post(this.COMMON_API+url,formData,{ headers: {} });
  }

  Usercommand(url,data){
      const formData = new FormData();      
      formData.append("command", JSON.stringify(data));
      return this.http.post(this.USERCOMMON_API+url,formData,{ headers: {} });
  }

  Userprofile(url,data,profile_pic){
    const formData = new FormData();
    formData.append("command", JSON.stringify(data));
    formData.append('image', profile_pic);
    return this.http.post(this.USERCOMMON_API+url, formData,{ headers: {} });
  }

  // CART Command
  Cartcommand(url,data){
    const formData = new FormData();      
    formData.append("command", JSON.stringify(data));
    return this.http.post(this.CARTCOMMON_API+url, formData,{ headers: {} });
  }

  //SERVICECOMMON_API
  Servicecommand(url,data){
    const formData = new FormData();      
    formData.append("command", JSON.stringify(data));
    return this.http.post(this.SERVICECOMMON_API+url, formData,{ headers: {} });
  }

  // Payment Response
  Cartpayment(data){
    const formData = new FormData();      
    //formData.append("command", JSON.stringify(data));
    return this.http.post('https://sandboxsecure.payu.in/_payment', formData);
  }


}