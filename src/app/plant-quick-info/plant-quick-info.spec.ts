import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantQuickInfo } from './plant-quick-info';

describe('PlantQuickInfo', () => {
  let component: PlantQuickInfo;
  let fixture: ComponentFixture<PlantQuickInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantQuickInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantQuickInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
