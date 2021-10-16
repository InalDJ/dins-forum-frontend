import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {VotePayload} from "../model/vote-payload";

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private http: HttpClient) { }

  vote(votePayload: VotePayload): Observable<string> {
    return this.http.post('http://localhost:8080/api/votes', votePayload, {responseType: 'text'});
  }
}
