import {Component, OnInit} from '@angular/core';
import {PostModel} from "../../../model/post-model";
import {CommentPayload} from "../../../model/comment-payload";
import {PostService} from "../../../services/post.service";
import {ActivatedRoute} from "@angular/router";
import {CommentService} from "../../../services/comment.service";
import {throwError} from "rxjs";
import {CommentResponse} from "../../../model/comment-response";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postId: number;
  post: PostModel;
  commentPayload: CommentPayload;
  commentResponse: CommentResponse = new CommentResponse();
  comments: CommentPayload[];

  commentQuantity: number = 10;
  pageNumber: number = 0;

  constructor(private postService: PostService, private activateRoute: ActivatedRoute,
              private commentService: CommentService) {
    this.postId = this.activateRoute.snapshot.params.id;

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
      commentCount: 0,
      files: []
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
    this.getCommentsForPost()
  }

  private getPostById() {
    this.postService.getPostById(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  private getCommentsForPost() {
    console.log('getAllCommentsForPost')
    this.commentService.getAllCommentsForPost(this.postId, this.pageNumber, this.commentQuantity).subscribe(data => {
      this.commentResponse = data;
      this.commentResponse.comments.map(comment => {
        comment.subCommentsHidden = true;
      })
    }, error => {
      throwError(error);
    });
  }
}
