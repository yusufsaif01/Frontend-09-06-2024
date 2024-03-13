import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgPopupComponent } from './msg-popup.component';

describe('MsgPopupComponent', () => {
  let component: MsgPopupComponent;
  let fixture: ComponentFixture<MsgPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MsgPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
