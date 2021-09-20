import { Component, OnInit } from '@angular/core';
import {throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PostService} from "../../../services/post.service";
import {TopicService} from "../../../services/topic.service";
import {TopicModel} from "../../../model/topic-model";
import {PostModel} from "../../../model/post-model";
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

  constructor(private router: Router, private postService: PostService,
              private topicService: TopicService) {
    this.postPayload = {
      postName: '',
      //url: '',
      description: '',
      topicName: ''
    }
  }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      subredditName: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.topicService.getAllTopics().subscribe((data) => {
      this.topics = data;
    }, error => {
      throwError(error);
    });
  }

  createPost() {
    this.postPayload.postName = this.createPostForm.get('postName')!.value;
    this.postPayload.topicName = this.createPostForm.get('subredditName')!.value;
    //this.postPayload.url = this.createPostForm.get('url').value;
    this.postPayload.description = this.createPostForm.get('description')!.value;

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
