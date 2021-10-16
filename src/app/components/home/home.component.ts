import { Component, OnInit } from '@angular/core';
import {PostService} from "../../services/post.service";
import {faCertificate, faFire, faStar} from '@fortawesome/free-solid-svg-icons';
import {PostModel} from "../../model/post-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orderType: string = 'new'
  posts: PostModel[];
  numberOfElementsPerPage: number = 5;
  totalPages: number = 1;
  pageNumber: number = 1;
  numberOfElementsTotal: number = 0;
  maxNumberOfPagesVisible:number = 6;
  model = 1;
  faPopular = faFire;
  faNew = faCertificate;
  faTop = faStar

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.getAllPosts()
  }

  getAllPosts() {
    console.log("getAllPosts - per page " + this.numberOfElementsPerPage)
    this.postService.getAllPosts(this.orderType, this.pageNumber - 1, this.numberOfElementsPerPage).subscribe(data => {
      this.posts = data.posts;
      this.pageNumber = data.pageNumber + 1
      this.numberOfElementsTotal = data.numberOfElementsTotal
    });
  }

  changeOrderType(orderType: string) {
    this.orderType = orderType
    this.getAllPosts();
  }

  updatePageSize(pageSize: number) {
    this.numberOfElementsPerPage = pageSize;
    this.pageNumber = 1
    this.getAllPosts();
  }
}
