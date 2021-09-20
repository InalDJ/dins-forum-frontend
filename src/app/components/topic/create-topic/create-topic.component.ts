import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TopicService} from "../../../services/topic.service";
import {TopicModel} from "../../../model/topic-model";
import {throwError} from "rxjs";

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {
  createTopicForm: FormGroup;
  topicModel: TopicModel;
  title = new FormControl('');
  description = new FormControl('');

  constructor(private router: Router, private topicService: TopicService) {
    this.createTopicForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
    this.topicModel = {
      name: '',
      description: '',
      createdDate: '',
      userName: '',
      numberOfPosts: 0,
      duration: ''
    }
  }

  ngOnInit() {
  }

  discard() {
    this.router.navigateByUrl('/');
  }

  createTopic() {
    this.topicModel.name = this.createTopicForm.get('title')?.value;
    this.topicModel.description = this.createTopicForm.get('description')?.value;
    this.topicService.createTopic(this.topicModel).subscribe(data => {
      this.router.navigateByUrl('/list-subreddits');
    }, error => {
      throwError(error);
    })
  }
}
