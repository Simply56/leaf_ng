import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlant } from './create-plant';

describe('CreatePlant', () => {
  let component: CreatePlant;
  let fixture: ComponentFixture<CreatePlant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlant]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePlant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
