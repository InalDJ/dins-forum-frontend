import {AfterViewInit, Component, OnInit} from '@angular/core';
import {PostModel} from "../../../model/post-model";
import {CommentPayload} from "../../../model/comment-payload";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../../services/comment.service";
import {throwError} from "rxjs";
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postId: number;
  post: PostModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];
  subComments: CommentPayload[];
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  constructor(private postService: PostService, private activateRoute: ActivatedRoute,
              private commentService: CommentService, private router: Router) {
    this.postId = this.activateRoute.snapshot.params.id;

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.post = {
      id: this.postId,
      postName: '',
      description: '',
      userName: '',
      topicName: '',
      voteCount: 0,
      duration: '',
      upVote: false,
      downVote: false,
      commentCount: 0
    }
    this.commentPayload = {
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
  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text')!.value;
    this.commentPayload.parentCommentId = 7;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text')!.setValue('');
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    })
  }

  private getPostById() {
    this.postService.getPostById(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
      this.comments.map(comment => comment.subCommentsHidden = true)
    }, error => {
      throwError(error);
    });
  }

  getCommentsForPostByParentComment(parentCommentId: number) {
    this.commentService.getAllCommentsForPostByParentComment(this.postId, parentCommentId).subscribe(data => {
      this.subComments = data;
    }, error => {
      throwError(error);
    });
  }

  setCollapse(commentId: number) {
    let comment = this.comments.find(comment => comment.id == commentId);
    if (comment != null) {
      comment.subCommentsHidden = !comment.subCommentsHidden
    }
  }
}
