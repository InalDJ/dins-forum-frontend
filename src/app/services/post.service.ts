import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostModel} from "../model/post-model";
import {LocalStorageService} from "ngx-webstorage";
import {PostPayload} from "../model/post-payload";
import {PostResponse} from "../model/post-response";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postUrl: string = 'http://localhost:8080/api/posts';
  postUrlNewest: string = 'http://localhost:8080/api/posts';
  postUrlPopular: string = 'http://localhost:8080/api/posts/popular';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
  }

  getAllPosts(orderType: string, pageNumber: number, postsPerPage: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(this.postUrlNewest, {
      params: {
        orderType: orderType,
        pageNumber: pageNumber,
        postsPerPage: postsPerPage
      }
    });
  }

  getPostById(id: number): Observable<PostModel> {
    return this.http.get<PostModel>(`${this.postUrl}/${id}`);
  }

  createPost(post: PostPayload): Observable<string> {
    return this.http.post(this.postUrl, post, {responseType: 'text'});
  }

  updatePost(post: PostModel): Observable<any> {
    return this.http.put(this.postUrl, post);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>('http://localhost:8080/api/posts/by-user/' + name);
  }

  deletePost(id: number): Observable<any> {
    console.log(this.localStorage.retrieve('authenticationToken'))
    return this.http.delete(`${this.postUrl}/${id}`);
  }
}
