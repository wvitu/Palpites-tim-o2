import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoFinalComponent } from './resultado-final.component';

describe('ResultadoFinalComponent', () => {
  let component: ResultadoFinalComponent;
  let fixture: ComponentFixture<ResultadoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
