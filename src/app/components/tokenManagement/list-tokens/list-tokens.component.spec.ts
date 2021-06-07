import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTokensComponent } from './list-tokens.component';

describe('ListTokensComponent', () => {
  let component: ListTokensComponent;
  let fixture: ComponentFixture<ListTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
