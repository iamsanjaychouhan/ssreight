import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { StarRatingComponent } from 'ng-starrating';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from "rxjs";
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'safetywagon';
  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    alert(`Old Value:${$event.oldValue}, 
      New Value: ${$event.newValue}, 
      Checked Color: ${$event.starRating.checkedcolor}, 
      Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  }


 subscription: Subscription;

 constructor(@Inject(WINDOW) private window: Window, private router: Router){}
 
 ngOnInit(){
  this.subscription = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe();
 }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
