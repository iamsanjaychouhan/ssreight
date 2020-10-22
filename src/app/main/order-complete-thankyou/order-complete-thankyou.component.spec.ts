import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompleteThankyouComponent } from './order-complete-thankyou.component';

describe('OrderCompleteThankyouComponent', () => {
  let component: OrderCompleteThankyouComponent;
  let fixture: ComponentFixture<OrderCompleteThankyouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCompleteThankyouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCompleteThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
