import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupRequest} from "../model/signup-request";
import {LoginRequest} from "../model/login-request";
import {Observable, throwError} from "rxjs";
import {map, tap} from "rxjs/operators";
import {AuthResponse} from "../model/auth-response";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  loginUrl='http://localhost:8080/api/auth/login';
  signupUrl='http://localhost:8080/api/auth/signup';
  logoutUrl='http://localhost:8080/api/auth/logout';
  refreshTokenUrl='http://localhost:8080/api/auth/refresh/token';

  refreshTokenRequest = {
    refreshToken: this.getRefreshToken(),
    username: this.getUsername()
  }

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  signup(signupRequest: SignupRequest){
    return this.http.post(this.signupUrl, signupRequest, {responseType: 'text'});
  }

  login(loginRequest: LoginRequest): Observable<boolean>{
    console.log('login started again')

    return this.http.post<AuthResponse>(this.loginUrl, loginRequest).pipe(
      map(
        data => {
          this.localStorage.store('authenticationToken', data.authenticationToken);
          this.localStorage.store('username', data.username);
          this.localStorage.store('refreshToken', data.refreshToken);
          console.log(data.authenticationToken)
          console.log(data.username)

          this.loggedIn.emit(true);
          this.username.emit(data.username);
          return true;
        }
      )
    )
  }

  logout(){
    this.refreshTokenRequest.refreshToken = this.getRefreshToken();
    this.refreshTokenRequest.username = this.getUsername();
    this.http.post(this.logoutUrl, this.refreshTokenRequest, {responseType: 'text'})
      .subscribe(data => {
          console.log(data);
        }, error => {
          throwError(error)
        }
      )
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('username');
    this.localStorage.clear('authenticationToken');
    this.loggedIn.emit(false);

  }

  refreshToken(){
    return this.http.post<AuthResponse>(this.refreshTokenUrl, this.refreshTokenRequest)
      .pipe(
        tap(
          response => {
            this.localStorage.clear('authenticationToken');
            this.localStorage.store('authenticationToken', response.authenticationToken);
          }, error => {
            throwError(error)
          }
        )
      )
  }

  getJwtToken(){
    return this.localStorage.retrieve('authenticationToken');
  }

  getUsername(){
    return this.localStorage.retrieve('username');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
