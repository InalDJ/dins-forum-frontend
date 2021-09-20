import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "ngx-webstorage";
import {TopicModel} from "../model/topic-model";

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topicUrl = 'http://localhost:8080/api/topics/newest';
  searchpostUrl = 'http://185.244.27.156:8080/api/posts/search';
  searchpostsByAuthorUrl = 'http://185.244.27.156:8080/api/posts/searchByAuthor';
  searchpostsByTagUrl = 'http://185.244.27.156:8080/api/posts/searchByTag';
  tagsUrl = 'http://185.244.27.156:8080/api/posts/tags';
  recommendenPostsUrl = 'http://185.244.27.156:8080/api/posts/recommendedPosts';
  adminPostUrl =  'http://185.244.27.156:8080/api/admin';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  getAllTopics() :Observable<any>{
    return this.http.get<any>(this.topicUrl);
  }

  getRecommendedPosts(id: number) :Observable<any>{
    return this.http.get(`${this.recommendenPostsUrl}/${id}`);
  }

  searchPosts(keyword: string): Observable<any>{
    return this.http.get(`${this.searchpostUrl}/${keyword}`);
  }

  searchPostsByAuthor(author: string): Observable<any>{
    return this.http.get(`${this.searchpostsByAuthorUrl}/${author}`);
  }

  searchPostsByTag(tag: string): Observable<any>{
    return this.http.get(`${this.searchpostsByTagUrl}/${tag}`);
  }

  createTopic(topicModel: TopicModel): Observable<TopicModel> {
    return this.http.post<TopicModel>('http://localhost:8080/api/topics',
      topicModel);
  }
}
