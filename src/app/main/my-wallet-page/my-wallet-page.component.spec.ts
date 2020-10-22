import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWalletPageComponent } from './my-wallet-page.component';

describe('MyWalletPageComponent', () => {
  let component: MyWalletPageComponent;
  let fixture: ComponentFixture<MyWalletPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWalletPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWalletPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
