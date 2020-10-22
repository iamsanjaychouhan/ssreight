import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayresponseComponent } from './payresponse.component';

describe('PayresponseComponent', () => {
  let component: PayresponseComponent;
  let fixture: ComponentFixture<PayresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
