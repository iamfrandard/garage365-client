import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerChatBoxComponent } from './taller-chat-box.component';

describe('TallerChatBoxComponent', () => {
  let component: TallerChatBoxComponent;
  let fixture: ComponentFixture<TallerChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerChatBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TallerChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
