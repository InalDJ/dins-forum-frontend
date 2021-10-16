import {Component, Directive, HostListener, OnInit} from '@angular/core';
import {PostModel} from "../../../model/post-model";
import {CommentPayload} from "../../../model/comment-payload";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../../services/comment.service";
import {throwError} from "rxjs";
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from "ngx-toastr";
import {CommentResponse} from "../../../model/comment-response";

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
  commentResponse: CommentResponse = new CommentResponse();
  comments: CommentPayload[];
  addedCommentResponse: CommentResponse = new CommentResponse();
  subComments: CommentPayload[];
  subCommentsMap: Map<number, CommentPayload[]>;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  commentQuantity: number = 10;
  pageNumber: number = 0;

  constructor(private postService: PostService, private activateRoute: ActivatedRoute,
              private commentService: CommentService, private router: Router, private toastr: ToastrService) {
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
    this.subCommentsMap = new Map<number, CommentPayload[]>();
  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost()
    // if (window.innerHeight > document.body.clientHeight) {
    //   this.commentQuantity += 2
    //   this.getCommentsForPost()
    // }
  }

    updatedSubcomments(updatedSubCommentsMap: Map<number, CommentPayload[]>) {
    for(let [parentCommentId, updatedSubcomments] of updatedSubCommentsMap) {
      this.subCommentsMap.set(parentCommentId, updatedSubcomments);
    }
      this.commentResponse.comments.map(comment => {
        for(let parentCommentId of updatedSubCommentsMap.keys()){
          if (comment.id == parentCommentId) {
            comment.subCommentCount += 1
            comment.subCommentsHidden = false
          }
        }

      })
  }

  postComment() {
    this.commentPayload.userName = "herwr"
    this.commentPayload.text = this.commentForm.get('text')!.value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text')!.setValue('');
      this.getCommentsForPost();
      this.toastr.success('The comment has been added!')
    }, error => {
      this.toastr.error('Failed!')
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

  private getAddedCommentsForPost() {
    console.log('method triggered')
    this.pageNumber += 1;
    console.log('pageNumber new - ' + this.pageNumber)
    this.commentService.getAllCommentsForPost(this.postId, this.pageNumber, 2).subscribe(data => {
      this.addedCommentResponse = data;
      this.pageNumber = data.pageNumber
      console.log(data.pageNumber + 'page number')
    }, error => {
      throwError(error);
    });
    this.addedCommentResponse.comments.map(comment => comment.subCommentsHidden = true)
    this.commentResponse.comments.push(...this.addedCommentResponse.comments)
  }

  getCommentsForPostByParentComment(parentCommentId: number) {
    this.commentService.getSubCommentsByPostANdParentComment(this.postId, parentCommentId).subscribe(data => {
      this.subComments = data;
      this.subCommentsMap.set(parentCommentId, this.subComments)
    }, error => {
      throwError(error);
    });
  }

  setCollapse(commentId: number) {
    let comment = this.commentResponse.comments.find(comment => comment.id == commentId);
    if (comment != null) {
      comment.subCommentsHidden = !comment.subCommentsHidden
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
//In chrome and some browser scroll is given to body tag
    let threshold = 0.7
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = Math.round(document.documentElement.scrollHeight);
// pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.

    if (pos + threshold > max && this.pageNumber != this.commentResponse.totalPages - 1) {
      console.log(this.pageNumber)
      this.getAddedCommentsForPost()
    }
  }
}
