import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCartComponent } from './login-cart.component';

describe('LoginCartComponent', () => {
  let component: LoginCartComponent;
  let fixture: ComponentFixture<LoginCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
