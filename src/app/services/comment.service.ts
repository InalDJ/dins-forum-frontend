import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentPayload} from "../model/comment-payload";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  getAllCommentsForPost(postId: number): Observable<CommentPayload[]> {
    return this.httpClient.get<CommentPayload[]>('http://localhost:8080/api/comments/post/' + postId);
  }

  getAllCommentsForPostByParentComment(postId: number, parentCommentId:number): Observable<CommentPayload[]> {
    return this.httpClient.get<CommentPayload[]>('http://localhost:8080/api/comments/post/' + postId + '/comment/' + parentCommentId);
  }

  getCommentById(commentId: number): Observable<CommentPayload> {
    return this.httpClient.get<CommentPayload>('http://localhost:8080/api/comments/' + commentId);
  }

  postComment(commentPayload: CommentPayload): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/comments/', commentPayload);
  }

  getAllCommentsByUser(name: string) {
    return this.httpClient.get<CommentPayload[]>('http://localhost:8080/api/comments/by-user/' + name);
  }
}
