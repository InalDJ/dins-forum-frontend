import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {CommentPayload} from "../model/comment-payload";
import {CommentResponse} from "../model/comment-response";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentToGoToSource = new BehaviorSubject(new CommentPayload());
  currentCommentToGoTo = this.commentToGoToSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  getAllCommentsForPost(postId: number, pageNumber: number, commentQuantity: number): Observable<CommentResponse> {
    return this.httpClient.get<CommentResponse>('http://localhost:8080/api/comments/post/' + postId + '?pageNumber=' + pageNumber + '&commentQuantity=' + commentQuantity);
  }

  getSubCommentsByPostAndParentComment(parentCommentId: number): Observable<CommentPayload[]> {
    return this.httpClient.get<CommentPayload[]>('http://localhost:8080/api/comments/parent-comment-id/'+ parentCommentId);
  }

  getCommentById(commentId: number): Observable<CommentPayload> {
    return this.httpClient.get<CommentPayload>('http://localhost:8080/api/comments/' + commentId);
  }

  postComment(commentPayload: CommentPayload): Observable<string> {
    return this.httpClient.post('http://localhost:8080/api/comments/', commentPayload, {responseType: 'text'});
  }

  getAllCommentsByUser(userName: string, pageNumber: number, commentQuantity: number): Observable<CommentResponse> {
    return this.httpClient.get<CommentResponse>('http://localhost:8080/api/comments/by-user', {
      params: {
        userName: userName,
        pageNumber: pageNumber,
        commentQuantity: commentQuantity
      }
    });
  }

  getCommentToGoTo(comment: CommentPayload) {
    this.commentToGoToSource.next(comment);
  }
}
