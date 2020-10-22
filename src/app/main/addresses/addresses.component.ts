import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { AlertService, UsersService } from '../../../_service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  data :any;
  deviceId = ''; AccessToken = '';
  userdata=''; uids=0; usermobile=""; username=""; usertype=''; useremail="";
  addreslist=""; selected=""; deliveryadress="";
  results="";
  newaddress="";
  gstin=""; email_id=""; address_name="";  city_name=""; state_name=""; pincode=""; addresstype=""; action="";
  gstin_err=""; email_id_err=""; address_name_err="";  city_name_err=""; state_name_err=""; pincode_err=""; addresstype_err="";
  token=true; addresId='';
  shippingPrice=""; hashkey=""; udf4='';udf3='';newpincode='';shipdata; 
  uname="";mobile_no="";name_err="";mobile_no_err="";landmark="";alt_phone="";gst_err="";gst="";uemail;uaid;editshowclose;selectedoption;editoption;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
  	public dialog: MatDialog,
  	private userService: UsersService,
  	private alertService: AlertService) { }

  ngOnInit() {
    this.userdata = this.localStorage.getItem('userdata');  
    if(this.userdata!=null){
      let sessdata = JSON.parse(this.userdata); 
      if(sessdata!=='' || sessdata!=='null'){
        this.uids = sessdata.user_id;
        this.usermobile = sessdata.mobile;
        this.username = sessdata.name;
        this.usertype = sessdata.user_type;
        this.useremail = sessdata.email;
      } 
    }
    this.deviceId = this.userService.generatecookie();
    setTimeout (() => {
      this.AccessToken = this.userService.GetAccessToken();
      this.addresslist();
    }, 80);
  }

  //get address list
  addresslist(uaid=''){
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid:uaid
    };
    this.userService.Apicommand('/changeAddresslist',this.data)
    .subscribe(
        result => {  
          var info = JSON.parse(JSON.stringify(result)); 
          this.addreslist = info.data;
          if(uaid!="")
          {
            this.uaid= uaid;
          } 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  //add new address
  NewAddress(){
    this.newaddress = 'NewAddress';
    //this.editshowclose='close';
  }

  //save new address
  saveaddresspersonal(){
    this.addresId='';
    this.name_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";this.addresstype_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.addresstype==""){ this.addresstype_err = 'Please choose location'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      address_type: this.addresstype,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Personal'
    };
    //console.log(this.data);debugger;
    this.userService.Apicommand('/addNewdeliveradrs',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult));
          this.newaddress='';          
          if(info.address_id !=''){
            location.reload();
            this.addresslist();
            //this.deliveryadress="close";
          }

        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  //show edit fields with data //personal
  editpersonalshow(addressid){
    this.newaddress='NewAddress';
    this.selectedoption='Personal';
    this.editoption='open';
    //this.editshowclose='open';
    this.action='edit';
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'view',
      access: this.usertype
    };

    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.address_name=info.data.a_address;  
          this.city_name = info.data.a_city; 
          this.state_name= info.data.a_state; 
          this.pincode = info.data.a_pincode; 
          this.addresstype= info.data.address_type;
          this.uname= info.data.uname;
          this.mobile_no= info.data.a_mobile; 
          this.landmark= info.data.landmark;
          this.alt_phone= info.data.alternate_number;
          this.gst= info.data.gst;
          this.email_id= info.data.uemail; 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  //show edit fields with data //Business
  editbussinessshow(addressid){
    this.selectedoption='Bussiness';
    this.newaddress='NewAddress';
    this.editoption='open';
    this.action='edit';
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'view',
      access: this.usertype
    };

    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.address_name=info.data.a_address;  
          this.city_name = info.data.a_city; 
          this.state_name= info.data.a_state; 
          this.pincode = info.data.a_pincode; 
          this.addresstype= info.data.address_type;
          this.uname= info.data.uname;
          this.mobile_no= info.data.a_mobile; 
          this.landmark= info.data.landmark;
          this.alt_phone= info.data.alternate_number;
          this.gst= info.data.gst;
          this.email_id= info.data.uemail; 
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  //save edited address of personal
  editaddresspersonal(addressid){
    //this.editshowclose='open';
    this.name_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      access:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Personal',
      uaid: addressid,
      address_type: this.addresstype,
      action: 'edit'
    };
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.newaddress='';
          this.addresslist();
          if(info.data.address_id!=''){
            //this.deliveryadress='close';
            location.reload();
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  //save edited address of business
  editaddressbussiness(addressid){
    this.name_err="";this.gst_err="";this.email_id_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.gst==""){this.gst_err = 'Please enter your gst'; this.token = false; }
    if(this.email_id==""){this.email_id_err = 'Please enter your email'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      access:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      gst:this.gst,
      email:this.email_id,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Bussiness',
      uaid: addressid,
      action: 'edit'
    };
    //console.log(this.data);
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          //console.log('sam');debugger;
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.newaddress='';
          this.addresslist();
          if(info.data.address_id!=''){
            location.reload();
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }

  //open dialog of remove address 
  openRemoveItemConfirmationDialog(addressid) {
    const dialogRef = this.dialog.open(removeAddConfirmationPopup);
    dialogRef.afterClosed().subscribe(result => { 
      console.log(`Dialog result: ${result}`);
      if(result!=undefined){
        console.log('Yes clicked');
        this.deleteaddress(addressid);
      }
    });
  }

  //delete address with id
  deleteaddress(addressid){
    this.addresId = addressid;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      uaid: addressid,
      action: 'delete',
      access: this.usertype
    };
    this.userService.Apicommand('/editdeleteAddress',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult)); 
          this.addresslist();
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    });
  }

  saveaddressbussiness(){
    this.addresId='';
    this.name_err="";this.gst_err="";this.email_id_err="";this.mobile_no_err="";this.address_name_err="";this.city_name_err="";this.state_name_err="";this.pincode_err="";
    this.token=true;
    if(this.uname==""){this.name_err = 'Please enter name'; this.token = false; }
    if(this.gst==""){this.gst_err = 'Please enter your gst'; this.token = false; }
    if(this.email_id==""){this.email_id_err = 'Please enter your email'; this.token = false; }
    if(this.mobile_no==""){this.mobile_no_err = 'Please enter your mobile'; this.token = false; }
    if(this.address_name==""){ this.address_name_err = 'Please enter your address'; this.token = false; }
    if(this.city_name==""){ this.city_name_err = 'Please enter your city name'; this.token = false; }
    if(this.state_name==""){ this.state_name_err = 'Please enter your state name'; this.token = false; }
    if(this.pincode==""){ this.pincode_err = 'Please enter your pincode'; this.token = false; }
    if(this.token==false) return false;
    this.data = {
      device_id:this.deviceId,
      device_type : '2',
      api_key :'Safety%@t$',
      access_token :this.AccessToken,
      uid: this.uids,
      usertype:this.usertype,
      name:this.uname,
      mobile_no:this.mobile_no,
      location:this.address_name,
      city:this.city_name,
      state: this.state_name,
      pincode: this.pincode,
      gst:this.gst,
      email:this.email_id,
      landmark:this.landmark,
      alt_phone:this.alt_phone,
      buytype:'Bussiness'
    };
    //console.log(this.data);debugger;
    this.userService.Apicommand('/addNewdeliveradrs',this.data)
    .subscribe(
        catresult => {  
          var info = JSON.parse(JSON.stringify(catresult));
          this.newaddress='';
          /*this.addresslist();*/
          if(info.data.address_id!=''){
            this.deliveryadress='close';
          }
        },
        error => {
          var info=JSON.parse(JSON.stringify(error));
    }); 
  }
}




@Component({
  selector: 'dialog-remove-item-confirmation',
  templateUrl: 'dialog-remove-item-confirmation.html',
  styleUrls: ['./addresses.component.scss']

})
export class removeAddConfirmationPopup {
  confirmoption:'';
  constructor( 
    public dialogRef: MatDialogRef<removeAddConfirmationPopup>,
    public dialog: MatDialog
    ) {} 
    confirmbtn(confm){
      this.confirmoption = confm;
      console.log(this.confirmoption);
    }
}
