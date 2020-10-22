import { Injectable, EventEmitter } from '@angular/core';
import { of , Observable, Subject, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartcountService {

 



  // private currentCartCount = new BehaviorSubject(0);
  // currentMessage = this.currentCartCount.asObservable();

  // constructor() {
  //  }
  //  updateCartCount(count: number) {
  //   this.currentCartCount.next(count)
  // }


  // count = 0;
  // simpleObservable = new Subject();
  // simpleObservable$ = this.simpleObservable.asObservable();
  // constructor() { }
  // addCount() {
  //   this.count+=1;
  //   this.simpleObservable.next(this.count)
  // }
  // removeCount() {
  //   if (this.count > 0) { this.count-=1 };
  //   this.simpleObservable.next(this.count)
  // }
  // getCount(){
  //   return this.simpleObservable$;
  // }

}