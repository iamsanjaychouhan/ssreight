import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loading = false;
  submitted = false;
  token = true;
  old_password =''; password=''; confirm_password=''; 
  old_password_err= ''; password_err=''; confirm_password_err=''; 
  userdata=''; AccessToken='';
  session:any;
  customer:any;
  deviceId='';
  data :any; 
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService
    ) {}

  ngOnInit() {
    this.userdata = this.localStorage.getItem('userdata');
    this.AccessToken = this.userService.GetAccessToken();
  }

  chanePasswordPopup() {

    this.submitted = true;
      this.old_password_err = ''; this.password_err=''; this.confirm_password_err=''; 
      this.token = true;
      this.AccessToken = this.userService.GetAccessToken();
      if(this.old_password==""){ this.old_password_err = 'Please enter your old password'; this.token = false; }
      if(this.password==""){ this.password_err = 'Please enter your new password'; this.token = false; }
      if(this.confirm_password==""){ this.confirm_password_err = 'Please enter your confirm password'; this.token = false; }
      if(this.confirm_password!=this.password){ this.confirm_password_err = 'Do not match your password or confirm password'; this.token = false; }

      if(this.token==true)
      {
          this.deviceId = this.userService.generatecookie();
          let sessdata = JSON.parse(this.userdata); 
          console.log(sessdata);
          this.data = {
            device_id:this.deviceId,
            device_type : '2',
            api_key :'Safety%@t$',
            access_token: this.AccessToken,
            old_password:this.old_password,
            password:this.password,
            uid:sessdata.user_id
          };

          this.userService.Usercommand('/changePassword',this.data)
          .subscribe(
              data => {  
                var info = JSON.parse(JSON.stringify(data));
                console.log(data);
                if(info.status==0)
                  this.old_password_err = info.response_message;

                if(info.status==1){
                  const dialogRef = this.dialog.open(ChangePasswordPopup);
                  dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                  });
                }
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
                  //this.loading = false;
          });        
      } 

    
  }

}
@Component({
  selector: 'change-password-update-modal',
  templateUrl: 'change-password-update-modal.html',
  styleUrls: ['./change-password.component.scss']

})
export class ChangePasswordPopup {
  constructor( 
    public dialogRef: MatDialogRef<ChangePasswordPopup>,
    public dialog: MatDialog
    ) {} 
}
