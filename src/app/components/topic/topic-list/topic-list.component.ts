import { Component, OnInit } from '@angular/core';
import {TopicModel} from "../../../model/topic-model";
import {throwError} from "rxjs";
import {TopicService} from "../../../services/topic.service";

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {

  topics: Array<TopicModel>;
  constructor(private topicService: TopicService) { }

  ngOnInit() {
    this.topicService.getAllTopics().subscribe(data => {
      this.topics = data;
    }, error => {
      throwError(error);
    })
  }
}
