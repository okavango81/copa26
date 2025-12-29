import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StikerCard } from './stiker-card';

describe('StikerCard', () => {
  let component: StikerCard;
  let fixture: ComponentFixture<StikerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StikerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StikerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
