import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarePage } from './care.page';

describe('CarePage', () => {
  let component: CarePage;
  let fixture: ComponentFixture<CarePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
