import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfailComponent } from './paymentfail.component';

describe('PaymentfailComponent', () => {
  let component: PaymentfailComponent;
  let fixture: ComponentFixture<PaymentfailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentfailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
