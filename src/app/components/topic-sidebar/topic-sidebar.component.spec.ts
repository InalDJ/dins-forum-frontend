import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSidebarComponent } from './topic-sidebar.component';

describe('TopicSidebarComponent', () => {
  let component: TopicSidebarComponent;
  let fixture: ComponentFixture<TopicSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
