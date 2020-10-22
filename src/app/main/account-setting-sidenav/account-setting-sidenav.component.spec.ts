import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingSidenavComponent } from './account-setting-sidenav.component';

describe('AccountSettingSidenavComponent', () => {
  let component: AccountSettingSidenavComponent;
  let fixture: ComponentFixture<AccountSettingSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
