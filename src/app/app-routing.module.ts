import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ViewPostComponent} from "./components/post/view-post/view-post.component";
import {CreatePostComponent} from "./components/post/create-post/create-post.component";
import {HomeComponent} from "./components/home/home.component";
import {SignupComponent} from "./components/auth/signup/signup.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {TopicListComponent} from "./components/topic/topic-list/topic-list.component";
import {CreateTopicComponent} from "./components/topic/create-topic/create-topic.component";
import {AuthGuard} from "./components/auth/auth-guard";
import {UpdatePostComponent} from "./components/post/update-post/update-post.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts/:id', component: ViewPostComponent },
  { path: 'user-profile/:name', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'list-topics', component: TopicListComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'update-post/:id', component: UpdatePostComponent, canActivate: [AuthGuard] },
  { path: 'create-topic', component: CreateTopicComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignupComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
