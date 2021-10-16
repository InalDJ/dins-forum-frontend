import {Component, OnInit} from '@angular/core';
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
  displayViewAll: boolean;
  orderType: string = 'new'
  pageNumber: number = 1
  numberOfElementsPerPage: number = 2;
  totalPages: number = 1;
  numberOfElementsTotal: number = 0;
  maxNumberOfPagesVisible: number = 6;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.getAllTopics()
  }

  getAllTopics() {
    this.topicService.getAllTopics(this.orderType, this.pageNumber - 1, this.numberOfElementsPerPage).subscribe(data => {
      this.topics = data.topics;
      this.pageNumber = data.pageNumber + 1
      this.numberOfElementsTotal = data.numberOfElementsTotal
    }, error => {
      throwError(error);
    })
  }

  updatePageSize(pageSize: number) {
    this.numberOfElementsPerPage = pageSize;
    this.pageNumber = 1
    this.getAllTopics();
  }
}
