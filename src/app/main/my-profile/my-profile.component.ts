import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { AlertService, UsersService } from '../../../_service';
import { CookieService } from 'ngx-cookie-service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
//import { HeaderComponent } from "../../layout/header/header.component";
//import { runInThisContext } from 'vm';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit  {
  loading = false;
  submitted = false;
  token = true;
  first_name =''; last_name=''; mobile_no=''; email_id='';company_name='';gstin='';
  firstName_err= ''; mobile_no_err=''; last_name_err=''; email_id_err='';company_name_err='';gstin_err='';showeditprofile;profile_pic='';
  userdata=''; AccessToken='';
  session:any;
  customer:any;
  deviceId='';
  data :any; 
  selecetdFile : File;
  imagePreview: any;user_type : any;
  //@ViewChild(HeaderComponent) header;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService
    ) {}
  //ngAfterViewInit (){}
  ngOnInit() {
    this.userdata = this.localStorage.getItem('userdata');
    let sessdata = JSON.parse(this.userdata);
    this.user_type = sessdata.user_type;
    //console.log(sessdata.gstin);
    let custName = sessdata.name.split(" ");
    this.customer = {'first_name':custName[0],'last_name':custName[1],'mobile_no':sessdata.mobile,'email':sessdata.email,'company_name':sessdata.company,'gstin':sessdata.gstin,'a_address':sessdata.a_address,'profile_pic':sessdata.profile_pic,'profilelink':'http://safetywagon.com/safetywagon_backend/assets/uploads/users/'+sessdata.user_id+'/' };
  }

  updateProfile() {
      this.submitted = true;
      this.firstName_err = ''; this.mobile_no_err=''; this.last_name_err=''; this.email_id_err='';
      this.mobile_no_err='';this.company_name_err='';this.gstin_err=''; 
      this.token = true;
      this.AccessToken = this.userService.GetAccessToken();
      //customer
      let sessdata = JSON.parse(this.userdata);
      this.user_type = sessdata.user_type;
      if(this.user_type == 'customer'){
        if(this.customer.first_name==""){ this.firstName_err = 'Please enter your first name'; this.token = false; }
        if(this.customer.last_name==""){ this.last_name_err = 'Please enter your last name'; this.token = false; }
        if(this.customer.mobile_no==""){ this.mobile_no_err = 'Please enter your mobile number'; this.token = false; }
      }else{
        /*if(this.customer.first_name==""){ this.firstName_err = 'Please enter your first name'; this.token = false; }
        if(this.customer.last_name==""){ this.last_name_err = 'Please enter your last name'; this.token = false; }*/
        if(this.customer.company_name==""){ this.company_name_err = 'Please enter your company name'; this.token = false; }
        if(this.customer.gstin==""){ this.gstin_err = 'Please enter your gst number'; this.token = false; }
        if(this.customer.mobile_no==""){ this.mobile_no_err = 'Please enter your mobile number'; this.token = false; }
      }
      if(this.token==true && this.user_type =='customer')
      {
        this.deviceId = this.userService.generatecookie();
        let sessdata = JSON.parse(this.userdata); 
        //console.log(sessdata.user_type);
        this.data = {
          device_id:this.deviceId,
          device_type : '2',
          api_key :'Safety%@t$',
          access_token: this.AccessToken,
          first_name:this.customer.first_name,
          last_name:this.customer.last_name,
          company_name:this.customer.company_name,
          gstin:this.customer.gstin,
          email:this.customer.email_id,
          mobile:this.customer.mobile_no,
          a_address:this.customer.a_address,
          access:sessdata.user_type,
          action:'edit',
          uid:sessdata.user_id,
          uaid:sessdata.uaid
          };
          //console.log(this.data);
          this.userService.Userprofile('/vieweditProfile',this.data,this.selecetdFile)
          .subscribe(
              data => {  
                var info = JSON.parse(JSON.stringify(data));
                //console.log(data);
                if(info.status==0)
                  this.mobile_no_err = info.response_message;
                if(info.status==1){
                  this.localStorage.removeItem('userdata');
                  this.localStorage.setItem('userdata', JSON.stringify(info.data));
                  /*const dialogRef = this.dialog.open(UpdateProfilePopup);
                  dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                  });*/
                  location.reload();
                }
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
                  //this.loading = false;
          });        
      }else{
        //console.log('sam');
        this.deviceId = this.userService.generatecookie();
        let sessdata = JSON.parse(this.userdata); 
        //console.log(sessdata.user_type);
        this.data = {
          device_id:this.deviceId,
          device_type : '2',
          api_key :'Safety%@t$',
          access_token: this.AccessToken,
          first_name:this.customer.company_name,
          last_name:'',
          company_name:this.customer.company_name,
          gstin:this.customer.gstin,
          email:this.customer.email_id,
          mobile:this.customer.mobile_no,
          a_address:this.customer.a_address,
          access:sessdata.user_type,
          action:'edit',
          uid:sessdata.user_id,
          uaid:sessdata.uaid
        };
          //console.log(this.data);
          this.userService.Userprofile('/vieweditProfile',this.data,this.selecetdFile)
          .subscribe(
              data => {  
                var info = JSON.parse(JSON.stringify(data));
                if(info.status==0)
                  this.mobile_no_err = info.response_message;
                if(info.status==1){
                  this.localStorage.removeItem('userdata');
                  this.localStorage.setItem('userdata', JSON.stringify(info.data));
                  /*const dialogRef = this.dialog.open(UpdateProfilePopup);
                  dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                  });*/
                  location.reload();
                }
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
          });
      } 
  }

  onFileUpload(event){
    const file = event.target.files[0];
    this.selecetdFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selecetdFile);
  }


  editprofileshow(){
    this.showeditprofile='open';  
  }
}
@Component({
  selector: 'profile-update-modal',
  templateUrl: 'profile-update-modal.html',
  styleUrls: ['./my-profile.component.scss']

})
export class UpdateProfilePopup {
  constructor( 
    public dialogRef: MatDialogRef<UpdateProfilePopup>,
    public dialog: MatDialog
    ) {} 
}