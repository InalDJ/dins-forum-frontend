import {Component, NgModule, OnInit} from '@angular/core';
import {PostModel} from "../../model/post-model";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";
import {CommentResponse} from "../../model/comment-response";
import {NgxSpinnerService} from "ngx-spinner";
import {CommentPayload} from "../../model/comment-payload";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userName: string;
  posts: PostModel[] = [];
  commentResponse: CommentResponse;
  postLength: number;
  commentLength: number;
  pageNumber: number = 1;
  numberOfElementsPerPage: number = 5;
  numberOfElementsTotal: number = 5;
  maxNumberOfPagesVisible: number = 6;

  isNavItemItPosts: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService,
              private commentService: CommentService, private spinnerService: NgxSpinnerService) {
    this.userName = this.activatedRoute.snapshot.params.name;

    this.getPostsByUser();

    this.getCommentsByUser()

    // this.postService.getAllPostsByUser(this.name).subscribe(data => {
    //   this.posts = data;
    //   this.postLength = data.length;
    // });
    // this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
    //   this.comments = data;
    //   this.commentLength = data.length;
    // });
  }

  ngOnInit(): void {
  }

  getItems() {
    if (this.isNavItemItPosts) {
      this.getPostsByUser()
      return;
    }
      this.getCommentsByUser()
  }

  getPostsByUser() {
    this.postService.getAllPostsByUser(this.userName,this.pageNumber - 1, this.numberOfElementsPerPage).subscribe(data => {
      this.posts = data.posts
      this.numberOfElementsPerPage = data.numberOfElementsPerPage
      this.pageNumber = data.pageNumber + 1;
      this.numberOfElementsTotal = data.numberOfElementsTotal

    })
  }

  getCommentsByUser() {
    this.commentService.getAllCommentsByUser(this.userName, this.pageNumber -1, this.numberOfElementsPerPage).subscribe(data => {
      this.commentResponse = data
      this.pageNumber = data.pageNumber + 1
      this.numberOfElementsTotal = data.numberOfElementsTotal
      this.commentResponse.comments.map(comment => {
        comment.subCommentsHidden = true;
      })
    })
  }

  goToComment(comment: CommentPayload) {
    console.log("GoToComment triggered")
    this.commentService.getCommentToGoTo(comment);
    // let params: NavigationExtras = {
    //   queryParams: {
    //     "commentId": comment.id
    //   }
    // };
    this.router.navigateByUrl("/posts/" + comment.postId);
  }

  updatePageSize(pageSize: number) {
    this.numberOfElementsPerPage = pageSize;
    this.pageNumber = 1
    if (this.isNavItemItPosts) {
      this.getPostsByUser();
      return;
    }
      this.getCommentsByUser();
  }

  // showSpinner(spinnerName: string) {
  //   this.isComponentHidden = true
  //   this.spinnerService.show(spinnerName);
  // }
  //
  // hideSpinner(spinnerName: string) {
  //   this.spinnerService.hide(spinnerName);
  //   this.isComponentHidden = false
  // }
}
