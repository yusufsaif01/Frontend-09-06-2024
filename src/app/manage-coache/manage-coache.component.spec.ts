import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecoacheComponent } from './manage-coache.component';

describe('ManagecoacheComponent', () => {
  let component: ManagecoacheComponent;
  let fixture: ComponentFixture<ManagecoacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagecoacheComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagecoacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
