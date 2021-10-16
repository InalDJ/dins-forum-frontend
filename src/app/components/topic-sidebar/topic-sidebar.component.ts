import { Component, OnInit } from '@angular/core';
import {TopicModel} from "../../model/topic-model";
import {TopicService} from "../../services/topic.service";

@Component({
  selector: 'app-topic-sidebar',
  templateUrl: './topic-sidebar.component.html',
  styleUrls: ['./topic-sidebar.component.css']
})
export class TopicSidebarComponent implements OnInit {
  topics: Array<TopicModel> = [];
  displayViewAll: boolean;
  orderType: string = 'NEW'
  pageNumber: number = 0
  topicsPerPage: number = 10

  constructor(private topicService: TopicService) {
    this.topicService.getAllTopics(this.orderType, this.pageNumber, this.topicsPerPage).subscribe(data => {
       if (data.topics.length > 3) {
         this.topics = data.topics.splice(0, 3);
         this.displayViewAll = true;
       } else {
         this.topics = data.topics;
       }
    });
  }

  ngOnInit(): void { }
}
