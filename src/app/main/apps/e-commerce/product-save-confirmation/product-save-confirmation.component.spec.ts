import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaveConfirmationComponent } from './product-save-confirmation.component';

describe('ProductSaveConfirmationComponent', () => {
  let component: ProductSaveConfirmationComponent;
  let fixture: ComponentFixture<ProductSaveConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSaveConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSaveConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
