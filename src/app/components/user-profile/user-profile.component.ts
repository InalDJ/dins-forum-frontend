import { Component, OnInit } from '@angular/core';
import {PostModel} from "../../model/post-model";
import {CommentPayload} from "../../model/comment-payload";
import {ActivatedRoute} from "@angular/router";
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userName: string;
  posts: PostModel[] = [];
  comments: CommentPayload[] = [];
  postLength: number;
  commentLength: number;
  pageNumber: number = 1;
  numberOfElementsPerPage: number = 5;
  numberOfElementsTotal: number = 5;
  maxNumberOfPagesVisible: number = 6;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService,
              private commentService: CommentService) {
    this.userName = this.activatedRoute.snapshot.params.name;

    this.getPostsByUser();

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

  getPostsByUser() {
    this.postService.getAllPostsByUser(this.userName,this.pageNumber - 1, this.numberOfElementsPerPage).subscribe(data => {
      this.posts = data.posts
      this.numberOfElementsPerPage = data.numberOfElementsPerPage
      this.pageNumber = data.pageNumber + 1;
      this.numberOfElementsTotal = data.numberOfElementsTotal
      console.log('data.numberOfElementsTotal - ' + data.numberOfElementsTotal)
      console.log('data.numberOfElementsPerPage - ' + data.numberOfElementsPerPage)
      console.log('data.pageNumber - ' + data.pageNumber)
    })
  }

  updatePageSize(pageSize: number) {
    this.numberOfElementsPerPage = pageSize;
    this.pageNumber = 1
    this.getPostsByUser();
  }
}
