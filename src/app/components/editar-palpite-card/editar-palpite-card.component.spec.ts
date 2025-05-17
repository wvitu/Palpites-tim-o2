import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPalpiteCardComponent } from './editar-palpite-card.component';

describe('EditarPalpiteCardComponent', () => {
  let component: EditarPalpiteCardComponent;
  let fixture: ComponentFixture<EditarPalpiteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPalpiteCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPalpiteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
