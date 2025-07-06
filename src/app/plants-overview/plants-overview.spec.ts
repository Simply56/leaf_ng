import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsOverview } from './plants-overview';

describe('PlantsOverview', () => {
  let component: PlantsOverview;
  let fixture: ComponentFixture<PlantsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
