import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesPageComponent } from './sub-categories-page.component';

describe('SubCategoriesPageComponent', () => {
  let component: SubCategoriesPageComponent;
  let fixture: ComponentFixture<SubCategoriesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoriesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
