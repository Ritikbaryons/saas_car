import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewbillComponent } from './previewbill.component';

describe('PreviewbillComponent', () => {
  let component: PreviewbillComponent;
  let fixture: ComponentFixture<PreviewbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewbillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
