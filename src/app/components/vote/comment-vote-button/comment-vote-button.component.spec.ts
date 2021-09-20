import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentVoteButtonComponent } from './comment-vote-button.component';

describe('CommentVoteButtonComponent', () => {
  let component: CommentVoteButtonComponent;
  let fixture: ComponentFixture<CommentVoteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentVoteButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentVoteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
