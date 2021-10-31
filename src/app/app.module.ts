import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { ViewPostComponent } from './components/post/view-post/view-post.component';
import { CreateTopicComponent } from './components/topic/create-topic/create-topic.component';
import { TopicListComponent } from './components/topic/topic-list/topic-list.component';
import { PostTileComponent } from './components/post/post-tile/post-tile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopicSidebarComponent } from './components/topic-sidebar/topic-sidebar.component';
import { VoteButtonComponent } from './components/vote/vote-button/vote-button.component';
import {NgxWebstorageModule} from "ngx-webstorage";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {TokenInterceptor} from "./token-interceptor";
import {EditorModule} from "@tinymce/tinymce-angular";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentVoteButtonComponent } from './components/vote/comment-vote-button/comment-vote-button.component';
import { UpdatePostComponent } from './components/post/update-post/update-post.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserProfileComponent,
    HeaderComponent,
    HomeComponent,
    CreatePostComponent,
    ViewPostComponent,
    CreateTopicComponent,
    TopicListComponent,
    PostTileComponent,
    SidebarComponent,
    TopicSidebarComponent,
    VoteButtonComponent,
    CommentVoteButtonComponent,
    UpdatePostComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxWebstorageModule.forRoot(),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        EditorModule,
        NgbModule,
        FormsModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
