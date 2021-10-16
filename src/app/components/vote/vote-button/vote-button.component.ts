import {Component, Input, OnInit} from '@angular/core';
import {PostModel} from "../../../model/post-model";
import {VotePayload} from "../../../model/vote-payload";
import {VoteService} from "../../../services/vote.service";
import {AuthService} from "../../../services/auth.service";
import {PostService} from "../../../services/post.service";
import {ToastrService} from "ngx-toastr";
import {VoteType} from "../../../model/vote-type";
import {throwError} from "rxjs";
import {faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {VoteCategory} from "../../../model/vote-category";
import {CommentPayload} from "../../../model/comment-payload";

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post: PostModel;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;

  constructor(private voteService: VoteService,
              private authService: AuthService,
              private postService: PostService, private toastr: ToastrService) {

    this.votePayload = {
      voteType: undefined,
      postId: undefined,
      voteCategory: VoteCategory.POSTVOTE
    }
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void {
    this.updateVoteDetails();
  }

  upvotePost() {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }

  downvotePost() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote() {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe(() => {
      this.toastr.success("Success")
      this.updateVoteDetails();
    }, error => {
      this.toastr.error('Failed');
      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.postService.getPostById(this.post.id).subscribe(post => {
      this.post = post;
    });
  }
}
