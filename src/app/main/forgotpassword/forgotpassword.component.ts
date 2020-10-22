import { Component, OnInit, Inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UsersService } from '../../../_service';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  submitted=false; token=true;
  uid=0;
  data :any;
  deviceId = ''; AccessToken = '';
  results :any; 
  password=''; confirm_password=''; 
  password_err=''; confirm_password_err='';

  private activatedRouteSubscription:Subscription;
  constructor(@Inject(WINDOW) private window: Window,
    private activatedRoute:ActivatedRoute,
    private http:HttpClient,
    private userService: UsersService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRouteSubscription = this.activatedRoute.params
    .subscribe(
      (p) =>{
          let params: any = p;
          this.uid = params['uid'];
      },
      (err) =>{
        //do something clever to inform user
        console.error(err);
      });
      console.log(this.uid);
      
    }

    resetpassword(){
      this.submitted = true;
      this.password_err=''; this.confirm_password_err=''; 
      this.token = true;
      this.AccessToken = this.userService.GetAccessToken();

      if(this.password==""){ this.password_err = 'Please enter your new password'; this.token = false; }
      if(this.confirm_password==""){ this.confirm_password_err = 'Please enter your confirm password'; this.token = false; }
      if(this.confirm_password!=this.password){ this.confirm_password_err = 'Do not match your password or confirm password'; this.token = false; }

      if(this.token==true)
      {
          this.deviceId = this.userService.generatecookie();
          this.data = {
            password:this.password,
            uid:this.uid
          };

          this.userService.Usercommand('/resetPwd',this.data)
          .subscribe(
              data => {  
                var info = JSON.parse(JSON.stringify(data));
                console.log(data);
                this.window.location.href="/";
                /* if(info.status==1){
                  const dialogRef = this.dialog.open(ChangePasswordPopup);
                  dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                  });
                } */
              },
              error => {
                var info=JSON.parse(JSON.stringify(error));
                  //this.loading = false;
          });        
      } 
    }

}

export class ChangePasswordPopup {
  constructor( 
    public dialogRef: MatDialogRef<ChangePasswordPopup>,
    public dialog: MatDialog
    ) {} 
}