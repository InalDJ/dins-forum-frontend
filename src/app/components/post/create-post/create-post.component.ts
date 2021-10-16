import { Component, OnInit } from '@angular/core';
import {throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PostService} from "../../../services/post.service";
import {TopicService} from "../../../services/topic.service";
import {TopicModel} from "../../../model/topic-model";
import {PostPayload} from "../../../model/post-payload";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  createPostForm: FormGroup;
  postPayload: PostPayload;
  topics: Array<TopicModel>;
  orderType: string = 'new'
  pageNumber: number = 0
  postsPerPage: number = 10

  constructor(private router: Router, private postService: PostService,
              private topicService: TopicService) {
    this.postPayload = {
      postName: '',
      //url: '',
      description: '',
      topicId: 0
    }
  }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      topicId: new FormControl(0, Validators.required),
      url: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.topicService.getAllTopics(this.orderType, this.pageNumber, this.postsPerPage).subscribe((data) => {
      this.topics = data.topics;
    }, error => {
      throwError(error);
    });
  }

  createPost() {
    this.postPayload.postName = this.createPostForm.get('postName')!.value;
    this.postPayload.topicId = this.createPostForm.get('topicId')!.value;
    //this.postPayload.url = this.createPostForm.get('url').value;
    this.postPayload.description = this.createPostForm.get('description')!.value;

    console.log('postName: ' + this.postPayload.postName)
    console.log('topicId: ' + this.postPayload.topicId)
    console.log('description: ' + this.postPayload.description)
    this.postService.createPost(this.postPayload).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, error => {
      throwError(error);
    })
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }
}
