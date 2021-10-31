import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentPayload} from "../model/comment-payload";
import {CommentResponse} from "../model/comment-response";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  getAllCommentsForPost(postId: number, pageNumber: number, commentQuantity: number): Observable<CommentResponse> {
    return this.httpClient.get<CommentResponse>('http://localhost:8080/api/comments/post/' + postId + '?pageNumber=' + pageNumber + '&commentQuantity=' + commentQuantity);
  }

  getSubCommentsByPostANdParentComment(postId: number, parentCommentId:number): Observable<CommentPayload[]> {
    return this.httpClient.get<CommentPayload[]>('http://localhost:8080/api/comments/post/' + postId + '/comment/' + parentCommentId);
  }

  getCommentById(commentId: number): Observable<CommentPayload> {
    return this.httpClient.get<CommentPayload>('http://localhost:8080/api/comments/' + commentId);
  }

  postComment(commentPayload: CommentPayload): Observable<string> {
    return this.httpClient.post('http://localhost:8080/api/comments/', commentPayload, {responseType: 'text'});
  }

  getAllCommentsByUser(userName: string, pageNumber: number, postsPerPage: number): Observable<CommentResponse> {
    return this.httpClient.get<CommentResponse>('http://localhost:8080/api/comments/by-user', {
      params: {
        userName: userName,
        pageNumber: pageNumber,
        postsPerPage: postsPerPage
      }
    });
  }
}
