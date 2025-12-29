import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumGrid } from './album-grid';

describe('AlbumGrid', () => {
  let component: AlbumGrid;
  let fixture: ComponentFixture<AlbumGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
