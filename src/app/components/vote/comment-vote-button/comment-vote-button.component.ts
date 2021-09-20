import {Component, Input, OnInit} from '@angular/core';
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


@Component({
  selector: 'app-comment-vote-button',
  templateUrl: './comment-vote-button.component.html',
  styleUrls: ['./comment-vote-button.component.css']
})
export class CommentVoteButtonComponent implements OnInit {

  @Input() comment: CommentPayload;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;
  public isCollapsed2 = true;

  constructor(private voteService: VoteService,
              private authService: AuthService,
              private commentService: CommentService, private toastr: ToastrService) {

    this.votePayload = {
      voteType: undefined,
      postId: undefined,
      voteCategory: VoteCategory.COMMENTVOTE,
      commentId: 0
    }
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void {
    this.updateVoteDetails();
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
    this.voteService.vote(this.votePayload).subscribe((data) => {
      this.toastr.success("Success")
      this.updateVoteDetails();
    }, error => {
      this.toastr.error(error.error.message);
      console.log('Vote fail')

      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.commentService.getCommentById(this.comment.id).subscribe(comment => {
      this.comment = comment;
    });
  }
}
