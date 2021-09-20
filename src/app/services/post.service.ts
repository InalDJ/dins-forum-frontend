import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostModel} from "../model/post-model";
import {LocalStorageService} from "ngx-webstorage";
import {PostPayload} from "../model/post-payload";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postUrl = 'http://localhost:8080/api/posts';
  postUrlNewest = 'http://localhost:8080/api/posts/newest';
  postUrlPopular = 'http://localhost:8080/api/posts/popular';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  getAllPosts() :Observable<PostModel[]>{
    return this.http.get<any>(this.postUrlNewest);
  }

  getPostById(id: number) :Observable<PostModel>{
    return this.http.get<PostModel>(`${this.postUrl}/${id}`);
  }

  createPost(post: PostPayload) : Observable<any>{
    return this.http.post(this.postUrl, post);
  }

  updatePost(post: PostModel) : Observable<any>{
    return this.http.put(this.postUrl, post);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>('http://localhost:8080/api/posts/by-user/' + name);
  }

  deletePost(id: number) : Observable<any>{
    console.log(this.localStorage.retrieve('authenticationToken'))
    return this.http.delete(`${this.postUrl}/${id}`);
  }
}
