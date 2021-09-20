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

  constructor(private topicService: TopicService) {
    this.topicService.getAllTopics().subscribe(data => {
      if (data.length > 3) {
        this.topics = data.splice(0, 3);
        this.displayViewAll = true;
      } else {
        this.topics = data;
      }
    });
  }

  ngOnInit(): void { }
}
