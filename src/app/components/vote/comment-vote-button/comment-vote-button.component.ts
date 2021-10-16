import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {VotePayload} from "../../../model/vote-payload";
import {VoteService} from "../../../services/vote.service";
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {VoteType} from "../../../model/vote-type";
import {throwError} from "rxjs";
import {faArrowDown, faArrowUp, faComments} from '@fortawesome/free-solid-svg-icons';
import {CommentPayload} from "../../../model/comment-payload";
import {VoteCategory} from "../../../model/vote-category";
import {CommentService} from "../../../services/comment.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-comment-vote-button',
  templateUrl: './comment-vote-button.component.html',
  styleUrls: ['./comment-vote-button.component.css']
})
export class CommentVoteButtonComponent implements OnInit {

  @Input() comment: CommentPayload;
  @Input() parentCommentId: number;
  @Output() updatedSubcomments = new EventEmitter<Map<number, CommentPayload[]>>();
  subComments: CommentPayload[];
  postId: number;
  subCommentForm: FormGroup;
  subCommentPayload: CommentPayload;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;
  public isCollapsed = true;

  constructor(private voteService: VoteService,
              private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private commentService: CommentService, private toastr: ToastrService) {
    this.postId = this.activateRoute.snapshot.params.id;
    this.votePayload = {
      voteType: undefined,
      postId: undefined,
      voteCategory: VoteCategory.COMMENTVOTE,
      commentId: 0
    }
    this.subCommentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });

    this.subCommentPayload = {
      id: 0,
      text: '',
      postId: this.postId,
      userName: '',
      duration: '',
      parentCommentId: 0,
      subCommentsHidden: true,
      subCommentCount: 0,
      upVoted: false,
      downVoted: false,
      voteCount: 0
    };
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void {
  }

  postSubComment() {
    this.subCommentPayload.parentCommentId = this.parentCommentId;
    this.subCommentPayload.text = this.getCommentReplyName(this.comment.userName) + ' ' + this.subCommentForm.get('text')!.value;
    this.commentService.postComment(this.subCommentPayload).subscribe(data => {
      this.subCommentForm.get('text')!.setValue('');
      this.toastr.success('The comment has been added!')
      this.commentService.getSubCommentsByPostANdParentComment(this.postId, this.parentCommentId).subscribe(data => {
        this.subComments = data;
        this.updateSubComments(this.subComments);
      }, error => {
        throwError(error);
      })

    }, error => {
      this.toastr.error('Failed!')
      throwError(error);
    })
  }

  updateSubComments(subComments: CommentPayload[]) {
    let updatedSubCommentsMap = new Map<number, CommentPayload[]>();
    updatedSubCommentsMap.set(this.parentCommentId, subComments);
    this.updatedSubcomments.emit(updatedSubCommentsMap);
    this.isCollapsed = true
  }

  private getCommentReplyName(userName: string): string {
    return '@' + userName;
  }

  upvoteComment() {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }

  downvoteComment() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote() {
    this.votePayload.commentId = this.comment.id;
    this.voteService.vote(this.votePayload).subscribe(data => {
      this.toastr.success("Success")
      this.updateVoteDetails();
    }, error => {
      this.toastr.error('Vote error');
      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.commentService.getCommentById(this.comment.id).subscribe(comment => {
      this.comment = comment;
    });
  }
}
