import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatStepperModule, MatSidenav, MAT_DIALOG_DATA, MatExpansionModule, MAT_PAGINATOR_INTL_PROVIDER, throwToolbarMixedModesError } from "@angular/material";
import { AlertService, UsersService } from '../../../_service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MustMatch } from '../../_helper/must-match.validator';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
export interface DialogData {
  otpdata: any;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  panelOpenState = false;
  loading = false;
  submitted = false;
  menuopen = false;
  data: any;
  deviceId = '';
  AccessToken = ''; userdata = '';
  session: any;
  catresults: any;
  request: any;
  otpemail = '';
  cartcount: any;
  sitetype = false; sitetypeval = 'false';
  searchkeyword = ''; headershow = true;customernumber: '';
  private activatedRouteSubscription: Subscription;
  private cookieValue: string;
  route: string;
  constructor(@Inject(WINDOW) private window: Window,@Inject(LOCAL_STORAGE) private localStorage: any,
    public dialog: MatDialog,
    private http: HttpClient,
    private userService: UsersService,
    private alertService: AlertService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }
  @ViewChild('sidenav', { read: true, static: false }) sidenav: MatSidenav;
  reason = '';
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
  opencategory() {
    this.menuopen = true;
  }
  closemenu() {
    this.menuopen = false;
  }
  ngOnInit() {
    this.sitetypeval = this.localStorage.getItem('sitetype');
    if (this.sitetypeval == 'true') {
      this.sitetype = true;
    }
    else if (this.sitetypeval == 'false') this.sitetype = false;
    else this.sitetype = false;
    this.cartcount = this.localStorage.getItem('cartcount');
    if (this.cartcount == null) this.cartcount = 0;
    this.userdata = this.localStorage.getItem('userdata');
    if (this.userdata)
      this.session = JSON.parse(this.userdata);
    else
      this.session = '';

    this.deviceId = this.userService.generatecookie();
    this.data = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$' };
    this.AccessToken = this.userService.GetAccessToken();
    if (this.AccessToken == "") {
      this.userService.accesstoken(this.data)
        .subscribe(
          data => {
            var info = JSON.parse(JSON.stringify(data));
            this.AccessToken = this.userService.GenerateAccessToken(info.access_token);
          },
          error => {
            this.alertService.error(error);
          });
    }else{
      this.AccessToken = this.userService.GetAccessToken();
    }
    this.request = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$', 'access_token': this.AccessToken };
    this.userService.Apicommand('/categoryList', this.request)
      .subscribe(
        catresult => {
          this.catresults = catresult['data'];
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
    this.customercare();
  }
  
  customercare(){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken
    };
    this.userService.Apicommand('/customercareno',this.data)
    .subscribe(
        data =>{  
          var info = JSON.parse(JSON.stringify(data));
         this.customernumber = info.data;
        },
      error => {
        var info=JSON.parse(JSON.stringify(error));
    });        
  }

  loginPopup() {
    const dialogRef = this.dialog.open(LoginOpanPopup);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /*login***/
  userPopup() {
    const dialogRef = this.dialog.open(UserTypePopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  /***usertype***/
  ResisterPopup() {
    const dialogRef = this.dialog.open(UserRegisterPopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  /***register***/
  CompaniPopup() {
    const dialogRef = this.dialog.open(CompaniRegisterPopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDealerDialog() {
    const dialogRef = this.dialog.open(DealerWelcomePopup);
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openSuccessfullFromSubmitDialog() {
    const dialogRef = this.dialog.open(SuccessfullFormSubmitPopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  logout() {
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    this.localStorage.removeItem('userdata');
    this.localStorage.clear();
    this.window.location.href = '/';
  }

  opan_header_menu() {
    document.getElementById("header-sidebar").style.cssText = "margin-left: 0px";
  }

  close_header_menu() {
    document.getElementById("header-sidebar").style.cssText = "margin-left: -300px";
  }

  onChangeToggle() {
    if (this.sitetype == true) {
      this.localStorage.setItem('sitetype', 'true');
      this.router.navigate(['service']);
    }
    else {

      this.localStorage.setItem('sitetype', 'false');
      this.router.navigate(['/']);
    }
  }

  Projectenquirydialog() {
    const dialogRef = this.dialog.open(ProjectEnquiryDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Bulkenquirydialog() {
    const dialogRef = this.dialog.open(BulkEnquiryDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  SellonSefetywagonDialog() {
    const dialogRef = this.dialog.open(SellonSefetywagonDialog);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Header Search
  headersearch() {
    this.data = { device_id: this.deviceId, device_type: '2', api_key: 'Safety%@t$', 'access_token': this.AccessToken, keyword: this.searchkeyword }
    this.userService.Apicommand('/productfilter', this.data)
      .subscribe(
        result => {
          this.catresults = result['data'];
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
  search_key() {
    let queryParam: any;
    this.activatedRoute.queryParams
      .subscribe(params => {
        queryParam = '?keyword=' + this.searchkeyword;
        // if(params.category!=undefined){
        //   //queryParam = { category: params.category, keyword: this.searchkeyword };
        //  queryParam =  '?keyword='+this.searchkeyword  ;
        // }else{
        //   queryParam = { keyword: this.searchkeyword };
        // }
      });
    //console.log(this.searchkeyword);debugger;
    //this.router.navigate(['/product/'], { queryParams: queryParam });
    if (this.searchkeyword != '') {
      this.window.location.href = '/product/' + queryParam;
    }
  }
}


@Component({
  selector: 'login-popup',
  templateUrl: 'login-popup.html',
  styleUrls: ['./header.component.scss']
})
/**login**/
export class LoginOpanPopup {
  loading = false;
  submitted = false;
  token = true;
  username = ''; password = '';
  username_err = ''; password_err = '';
  deviceId = ''; AccessToken = '';
  data: any;
  constructor(
    public dialogRef: MatDialogRef<LoginOpanPopup>,
    private userService: UsersService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }

  forgotPopup() {
    const dialogRef = this.dialog.open(ForgotOpanPopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onSubmit() {
    this.submitted = true;
    this.username_err = ''; this.password_err = '';
    this.token = true;
    if (this.username == "") { this.username_err = 'Please enter your email address or mobile number'; this.token = false; }
    if (this.password == "") { this.password_err = 'Please enter your password'; this.token = false; }
    if (this.token == true) {
      this.deviceId = this.userService.generatecookie();
      this.AccessToken = this.userService.GetAccessToken();
      this.data = {
        device_id: this.deviceId,
        device_type: '2',
        api_key: 'Safety%@t$',
        access_token: this.AccessToken,
        email: this.username,
        password: this.password
      };

      this.userService.login(this.data)
        .subscribe(
          data => {
            var info = JSON.parse(JSON.stringify(data));
            if (info.status == 0) {
              this.password_err = info.response_message;
              /*const dialogRef = this.dialog.open(VerificationPopup, { data: { 'otpemail': this.email_id } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });*/
            }
            else {
              localStorage.setItem('userdata', JSON.stringify(info.data));
              location.reload();
            }
          },
          error => {
            var info = JSON.parse(JSON.stringify(error));
          });
    }
  }
  userPopup() {
    const dialogRef = this.dialog.open(UserTypePopup);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
/* forgot password */
@Component({
  selector: 'forgot-pass-popup',
  templateUrl: 'forgot-pass-popup.html',
  styleUrls: ['./header.component.scss']

})
export class ForgotOpanPopup {
  forgot_email = '';
  email_err = '';
  loading = false;
  submitted = false;
  token = true;
  deviceId = ''; AccessToken = '';
  data: any;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ForgotOpanPopup>,
    public dialog: MatDialog,
    private userService: UsersService,
    private alertService: AlertService,
    private _formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.forgot_email == '') {
      this.email_err = 'Please enter your email'; return false;
    }
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    this.data = {
      email: this.forgot_email
    };
    this.userService.Usercommand('/forgot_password', this.data)
      .subscribe(
        data => {
          var info = JSON.parse(JSON.stringify(data));
          if (info.status == 0) {
            this.email_err = info.response_message;
          }
          if (info.status == 1) {
            this.email_err = info.response_message;
            //location.reload();
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
}

/**usertype**/
@Component({  
  selector: 'verification-code-popup',
  templateUrl: 'verification-code-popup.html',
  styleUrls: ['./header.component.scss']
})
export class VerificationPopup {
  verify_error = '';
  loading = false;
  submitted = false;
  token = true;
  num_1 = ''; num_2 = ''; num_3 = ''; num_4 = '';
  deviceId = '';
  data: any;type;
  otpemail = ''; AccessToken = '';
  constructor(
    public dialogRef: MatDialogRef<VerificationPopup>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public otpdata: DialogData,
    private userService: UsersService,
    private alertService: AlertService) {
  }
  ngOnInit() {
    let emails = JSON.stringify(this.otpdata);
  }
  checkverifyOTP() {
    if (this.num_1 == '' || this.num_2 == '' || this.num_3 == '' || this.num_4 == '') {
      this.verify_error = 'Please enter otp number'; return false;
    }
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    if(this.otpdata['type'] == 'enquiry'){
      this.type = 'enquiry';
    }else{
      this.type = 'verify';
    }
    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      otp: this.num_1 + this.num_2 + this.num_3 + this.num_4,
      type:this.type,
      access_token: this.AccessToken,
      email: this.otpdata['otpemail']
    };
    this.userService.Apicommand('/verifyotp', this.data)
      .subscribe(
        data => {
          var info = JSON.parse(JSON.stringify(data));
          if(info.status == 0) {
            this.verify_error = 'Please enter correct otp number'; return false;
          }else if(info.status == 22){
            const dialogRef = this.dialog.open(DealerWelcomePopup);
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
              setTimeout(() => { this.dialogRef.close(); }, 100);
          }else if(info.status == 222){
            const dialogRef = this.dialog.open(SuccessfullFormSubmitPopup);
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
            });
            setTimeout(() => { this.dialogRef.close(); }, 100)
          }
          else {
            localStorage.removeItem('userdata');
            localStorage.setItem('userdata', JSON.stringify(info.data));
            location.reload();
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
  }
}

/* - Register Popup -  */
@Component({
  selector: 'user-register-popup',
  templateUrl: 'user-register-popup.html',
  styleUrls: ['./header.component.scss']
})
export class UserRegisterPopup {
  loading = false;
  submitted = false;
  token = true;
  firstName = ''; last_name = ''; mobile_no = ''; email_id = ''; password = ''; confirm_password = '';
  firstName_err = ''; mobile_no_err = ''; last_name_err = ''; email_id_err = ''; password_err = ''; confirm_password_err = '';
  deviceId = '';
  data: any;
  constructor(
    public dialogRef: MatDialogRef<UserRegisterPopup>,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private alertService: AlertService,
    private cookieService: CookieService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }

  verification() {
    const dialogRef = this.dialog.open(VerificationPopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {

  }
  onSubmit() {
    this.submitted = true;
    this.firstName_err = ''; this.mobile_no_err = ''; this.last_name_err = ''; this.email_id_err = '';
    this.mobile_no_err = ''; this.password_err = ''; this.confirm_password_err = '';
    this.token = true;
    if (this.firstName == "") { this.firstName_err = 'Please enter your first name'; this.token = false; }
    if (this.last_name == "") { this.last_name_err = 'Please enter your last name'; this.token = false; }
    if (this.email_id == "") { this.email_id_err = 'Please enter your email address'; this.token = false; }
    if (this.mobile_no == "") { this.mobile_no_err = 'Please enter your mobile number'; this.token = false; }
    if (this.password == "") { this.password_err = 'Please enter your password'; this.token = false; }
    if (this.confirm_password == "") { this.confirm_password_err = 'Please enter your confirm password'; this.token = false; }
    if (this.confirm_password != this.password) { this.confirm_password_err = 'Do not match your password or confirm password'; this.token = false; }
    if (this.token == true) {
      this.deviceId = this.userService.generatecookie();
      this.data = {
        device_id: this.deviceId,
        device_type: '2',
        api_key: 'Safety%@t$',
        first_name: this.firstName,
        last_name: this.last_name,
        email: this.email_id,
        mobile: this.mobile_no,
        password: this.password,
        access: 'customer',
        buytype: 'Personal',
      };
      this.userService.register(this.data)
        .subscribe(
          data => {
            var info = JSON.parse(JSON.stringify(data));
            if (info.status == 0 && info.response_message.email)
              this.email_id_err = info.response_message.email;
            else if (info.status == 0 && info.response_message.mobile)
              this.mobile_no_err = info.response_message.mobile;
            else {
              const dialogRef = this.dialog.open(VerificationPopup, { disableClose: true, data: { 'otpemail': this.email_id } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
                if(info.data.otp_code){
                  this.http.get('https://www.unicel.in/SendSMS/sendmsg.php?uname=ksit123&pass=ksit123&send=KSITIN&dest='+this.mobile_no + '&msg=Your Safety Wagon registration code is'+info.data.otp_code).subscribe(data => {
                  });
                }
            }
          },
          error => {
            var info = JSON.parse(JSON.stringify(error));
          });
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
    }
  }
  loginPopup() {
    const dialogRef = this.dialog.open(LoginOpanPopup);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}


@Component({
  selector: 'dealer-welcome-popup',
  templateUrl: 'dealer-welcome-popup.html',
  styleUrls: ['./header.component.scss']
})
export class DealerWelcomePopup {
  constructor(public dialogRef: MatDialogRef<DealerWelcomePopup>, public dialog: MatDialog) { }
  openDealerDialog() {
    const dialogRef = this.dialog.open(DealerWelcomePopup);
    dialogRef.afterClosed().subscribe(result => { });
  }
}

@Component({
  selector: 'compani-register-popup',
  templateUrl: 'compani-register-popup.html',
  styleUrls: ['./header.component.scss']
})
export class CompaniRegisterPopup {
  loading = false;
  submitted = false;
  token = true;
  company_name = ''; email_id = ''; mobile_no = ''; gstin = ''; password = ''; confirm_password = ''; address = '';
  company_name_err = ''; email_id_err = ''; mobile_no_err = ''; gstin_err = ''; address_err = ''; password_err = ''; confirm_password_err = '';
  deviceId = ''; otpemail: any; success = '';
  data: any;
  constructor(
    public dialogRef: MatDialogRef<CompaniRegisterPopup>,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private alertService: AlertService,
    private cookieService: CookieService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }

  verification() {
    const dialogRef = this.dialog.open(VerificationPopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onSubmit() {
    this.submitted = true;
    this.company_name_err = ''; this.mobile_no_err = ''; this.email_id_err = ''; this.address_err = '';
    this.mobile_no_err = ''; this.password_err = ''; this.confirm_password_err = ''; this.gstin_err = '';
    this.token = true;
    if (this.company_name == "") { this.company_name_err = 'Please enter your company name'; this.token = false; }
    if (this.email_id == "") { this.email_id_err = 'Please enter your email address'; this.token = false; }
    if (this.mobile_no == "") { this.mobile_no_err = 'Please enter your mobile number'; this.token = false; }
    if (this.password == "") { this.password_err = 'Please enter your password'; this.token = false; }
    if (this.gstin == "") { this.gstin_err = 'Please enter your GSTIN number'; this.token = false; }
    if (this.confirm_password == "") { this.confirm_password_err = 'Please enter your confirm password'; this.token = false; }
    if (this.confirm_password != this.password) { this.confirm_password_err = 'Do not match your password or confirm password'; this.token = false; }
    if (this.token == true) {
      this.deviceId = this.userService.generatecookie();
      this.data = {
        device_id: this.deviceId,
        device_type: '2',
        api_key: 'Safety%@t$',
        company_name: this.company_name,
        email: this.email_id,
        mobile: this.mobile_no,
        password: this.password,
        location: this.address,
        gstin: this.gstin,
        access: 'company',
        buytype: 'Business'
      };
      this.userService.register(this.data)
        .subscribe(
          data => {
            var info = JSON.parse(JSON.stringify(data));
            console.log(info);
            if (info.status == 0 && info.response_message.email)
              this.email_id_err = info.response_message.email;
            else if (info.status == 0 && info.response_message.mobile)
              this.mobile_no_err = info.response_message.mobile;
            else {
              const dialogRef = this.dialog.open(VerificationPopup, { disableClose: true, data: { 'otpemail': this.email_id } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
                if(info.data.otp_code){
                  this.http.get('https://www.unicel.in/SendSMS/sendmsg.php?uname=ksit123&pass=ksit123&send=KSITIN&dest='+this.mobile_no + '&msg=Your Safety Wagon registration code is'+info.data.otp_code).subscribe(data => {
                  });
                }
            }
          },
          error => {
            var info = JSON.parse(JSON.stringify(error));
          });
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
    }
  }
  ngOnInit() {

  }
  loginPopup() {
    const dialogRef = this.dialog.open(LoginOpanPopup);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

@Component({
  selector: 'user-type-popup',
  templateUrl: 'user-type-popup.html',
  styleUrls: ['./header.component.scss']
})
export class UserTypePopup {
  usertype = 'user';
  disable = 'disabled';
  constructor(
    public dialogRef: MatDialogRef<UserTypePopup>,
    public dialog: MatDialog) { }

  RegisterPopup() {
    const dialogRef = this.dialog.open(UserRegisterPopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  CompaniPopup() {
    const dialogRef = this.dialog.open(CompaniRegisterPopup);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /* Choose type */
  choosetype(type) {
    this.disable = '';
    this.usertype = type;
  }
}

@Component({
  selector: 'project-enquiry-dialog',
  templateUrl: './project-enquiry-dialog.html',
  styleUrls: ['./header.component.scss']
})
export class ProjectEnquiryDialog {
  data: any;
  deviceId = ''; AccessToken = '';
  userdata = ''; uids = 0; uaid = '';
  enq_name = ""; enq_company_name = ""; email_address = ""; phone_number = ""; message = "";
  enq_name_err = ""; enq_company_name_err = ""; email_address_err = ""; phone_number_err = ""; message_err = "";
  token = true; success = '';
  constructor(
    public dialogRef: MatDialogRef<ProjectEnquiryDialog>,
    public dialog: MatDialog,
    private userService: UsersService,
    private spinner: NgxSpinnerService
  ) { }

  onSubmit() {
    this.enq_company_name_err = ''; this.enq_name_err = ''; this.email_address_err = ''; this.phone_number_err = ''; this.message_err = '';
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    this.token = true;
    if (this.enq_name == "") { this.enq_name_err = 'Please enter your name'; this.token = false; }
    if (this.enq_company_name == "") { this.enq_company_name_err = 'Please enter your company name'; this.token = false; }
    if (this.email_address == "") { this.email_address_err = 'Please enter your email address'; this.token = false; }
    if (this.phone_number == "") { this.phone_number_err = 'Please enter your mobile number'; this.token = false; }
    if (this.message == "") { this.message_err = 'Please enter your message'; this.token = false; }
    if (this.token == false) return false;

    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      enq_name: this.enq_name,
      enq_company_name: this.enq_company_name,
      email_address: this.email_address,
      phone_number: this.phone_number,
      message: this.message,
      type: 'project_enq'
    };
    this.userService.Servicecommand('/enquiries', this.data)
      .subscribe(
        result => {
          var info = JSON.parse(JSON.stringify(result));
          if (info.status == 0) {
            if (info.response_message.email_address != '')
              this.email_address_err = info.response_message.email_address;
            if (info.response_message.phone_number != '')
              this.phone_number_err = info.response_message.phone_number;
          }
          else {
            const dialogRef = this.dialog.open(VerificationPopup, { disableClose: true, data: { 'otpemail': this.email_address,'type':'enquiry' } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2500);
  }
}

@Component({
  selector: 'bulk-enquiry-dialog',
  templateUrl: './bulk-enquiry-dialog.html',
  styleUrls: ['./header.component.scss']
})
export class BulkEnquiryDialog {
  data: any;
  deviceId = ''; AccessToken = '';
  userdata = ''; uids = 0; uaid = '';
  enq_name = ""; enq_company_name = ""; email_address = ""; phone_number = ""; message = "";
  enq_name_err = ""; enq_company_name_err = ""; email_address_err = ""; phone_number_err = ""; message_err = "";
  token = true; success = '';

  constructor(
    public dialogRef: MatDialogRef<BulkEnquiryDialog>,
    public dialog: MatDialog,
    private userService: UsersService,
    private spinner: NgxSpinnerService
  ) { }

  onSubmit() {
    this.enq_company_name_err = ''; this.enq_name_err = ''; this.email_address_err = ''; this.phone_number_err = ''; this.message_err = '';
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    this.token = true;
    if (this.enq_name == "") { this.enq_name_err = 'Please enter your name'; this.token = false; }
    if (this.enq_company_name == "") { this.enq_company_name_err = 'Please enter your company name'; this.token = false; }
    if (this.email_address == "") { this.email_address_err = 'Please enter your email address'; this.token = false; }
    if (this.phone_number == "") { this.phone_number_err = 'Please enter your mobile number'; this.token = false; }
    if (this.message == "") { this.message_err = 'Please enter your message'; this.token = false; }
    if (this.token == false) return false;

    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      enq_name: this.enq_name,
      enq_company_name: this.enq_company_name,
      email_address: this.email_address,
      phone_number: this.phone_number,
      message: this.message,
      type: 'bulk_enq'
    };
    this.userService.Servicecommand('/enquiries', this.data)
      .subscribe(
        result => {
          var info = JSON.parse(JSON.stringify(result));
          if (info.status == 0) {
            if (info.response_message.email_address != '')
              this.email_address_err = info.response_message.email_address;
            if (info.response_message.phone_number != '')
              this.phone_number_err = info.response_message.phone_number;
          }
          else {
            const dialogRef = this.dialog.open(VerificationPopup, { disableClose: true, data: { 'otpemail': this.email_address,'type':'enquiry' } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2500);
  }
}

@Component({
  selector: 'sellon-sefety-dialog',
  templateUrl: './sellon-sefety-dialog.html',
  styleUrls: ['./header.component.scss']
})
export class SellonSefetywagonDialog {
  data: any;
  deviceId = ''; AccessToken = '';
  userdata = ''; uids = 0; uaid = '';
  enq_name = ""; enq_company_name = ""; gstin = ''; email_address = ""; phone_number = ""; message = "";
  enq_name_err = ""; enq_company_name_err = ""; gstin_err = ""; email_address_err = ""; phone_number_err = ""; message_err = "";
  token = true; success = '';

  constructor(
    public dialogRef: MatDialogRef<SellonSefetywagonDialog>,
    public dialog: MatDialog,
    private userService: UsersService,
    private spinner: NgxSpinnerService
  ) { }

  onSubmit() {
    this.enq_company_name_err = ''; this.gstin_err = ""; this.enq_name_err = ''; this.email_address_err = ''; this.phone_number_err = ''; this.message_err = '';
    this.deviceId = this.userService.generatecookie();
    this.AccessToken = this.userService.GetAccessToken();
    this.token = true;
    if (this.enq_name == "") { this.enq_name_err = 'Please enter your name'; this.token = false; }
    if (this.enq_company_name == "") { this.enq_company_name_err = 'Please enter your company name'; this.token = false; }
    if (this.gstin == "") { this.gstin_err = 'Please enter your GSTIN number'; this.token = false; }
    if (this.email_address == "") { this.email_address_err = 'Please enter your email address'; this.token = false; }
    if (this.phone_number == "") { this.phone_number_err = 'Please enter your mobile number'; this.token = false; }
    if (this.message == "") { this.message_err = 'Please enter your message'; this.token = false; }
    if (this.token == false) return false;

    this.data = {
      device_id: this.deviceId,
      device_type: '2',
      api_key: 'Safety%@t$',
      access_token: this.AccessToken,
      enq_name: this.enq_name,
      enq_company_name: this.enq_company_name,
      gstin: this.gstin,
      email_address: this.email_address,
      phone_number: this.phone_number,
      message: this.message,
      type: 'bulk_enq'
    };
    this.userService.Servicecommand('/enquiries', this.data)
      .subscribe(
        result => {
          var info = JSON.parse(JSON.stringify(result));
          if (info.status == 0) {
            if (info.response_message.email_address != '')
              this.email_address_err = info.response_message.email_address;
            if (info.response_message.phone_number != '')
              this.phone_number_err = info.response_message.phone_number;
          }
          else {
            const dialogRef = this.dialog.open(VerificationPopup, { disableClose: true, data: { 'otpemail': this.email_address,'type':'enquiry' } });
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
          }
        },
        error => {
          var info = JSON.parse(JSON.stringify(error));
        });
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2500);
  }
}

@Component({
  selector: 'successfull-form-submit-popup',
  templateUrl: 'successfull-form-submit-popup.html',
  styleUrls: ['./header.component.scss']
})
export class SuccessfullFormSubmitPopup {
  constructor(public dialogRef: MatDialogRef<SuccessfullFormSubmitPopup>, public dialog: MatDialog) { }
  openDealerDialog() {
    const dialogRef = this.dialog.open(SuccessfullFormSubmitPopup);
    dialogRef.afterClosed().subscribe(result => { });
  }
}
