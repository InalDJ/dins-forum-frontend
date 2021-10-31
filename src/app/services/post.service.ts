import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostModel} from "../model/post-model";
import {LocalStorageService} from "ngx-webstorage";
import {PostPayload} from "../model/post-payload";
import {PostResponse} from "../model/post-response";
import {ImageService} from "./image.service";
import {ImageDeleteRequest} from "../model/image-delete-request";
import {FilePayload} from "../model/file-payload";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  uploadedImagesMap: Map<string, string> = new Map<string, string>();
  imagesToDeletePathList: string[] = [];
  imagesToDeleteUrlList: string[] = [];

  postUrl: string = 'http://localhost:8080/api/posts';
  postUrlNewest: string = 'http://localhost:8080/api/posts';
  postUrlPopular: string = 'http://localhost:8080/api/posts/popular';

  constructor(private http: HttpClient, private localStorage: LocalStorageService, private imageService: ImageService) {
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
    console.log(this.imagesToDeletePathList === undefined || this.imagesToDeletePathList.length == 0)
   this.deleteImagesFromServer();
   post.files = this.getFilePayloadList() || undefined;
    this.uploadedImagesMap = new Map<string, string>()
    return this.http.post(this.postUrl, post, {responseType: 'text'});
  }

  private getFilePayloadList(): FilePayload[] | null {
    if (this.uploadedImagesMap == undefined || this.uploadedImagesMap.size == 0) {
      return null;
    }
    let filePayloadList: FilePayload[] = []
    for(let imageUrl of this.uploadedImagesMap.keys()) {
      let filePayload = new FilePayload(imageUrl, this.uploadedImagesMap.get(imageUrl) || '');
      console.log('filePayload.url - ' + filePayload.url)
      filePayloadList.push(filePayload)
    }
    return filePayloadList;
  }

  deleteImagesFromServer() {
    console.log('deleteImagesFromServer has been triggered')
    if (this.imagesToDeletePathList === undefined || this.imagesToDeletePathList.length == 0) {
      console.log("imagesToDelete list is empty")
      return;
    }
    this.imageService.deleteImage(new ImageDeleteRequest(this.imagesToDeletePathList)).subscribe(data => console.log("Delete successfully"))
    this.imagesToDeletePathList = [];
    this.imagesToDeleteUrlList = [];
  }

  getUploadedImagePath(imageUrl: string): string {
    return this.uploadedImagesMap.get(imageUrl) || '';
  }

  updatePost(post: PostPayload): Observable<any> {
    console.log(this.imagesToDeletePathList === undefined || this.imagesToDeletePathList.length == 0)
    let updatedFilePayloadList = this.getUpdatedFilePayloadList(post) || undefined;
    post.files = updatedFilePayloadList
    this.deleteImagesFromServer();
    this.uploadedImagesMap = new Map<string, string>()
    return this.http.put(this.postUrl, post, {responseType: 'text'});
  }

  private getUpdatedFilePayloadList(post: PostPayload): FilePayload[] | undefined {
    // if (this.uploadedImagesMap == undefined || this.uploadedImagesMap.size == 0) {
    //   return post.files;
    // }
    if (post.files == undefined || post.files.length == 0) {
      post.files = []
    }
    let updatedFilePayloadList = [...post.files];
    for (let imageToDeletePath of this.imagesToDeletePathList) {
      post.files.forEach( (filePayload, index) => {
        if (filePayload.path === imageToDeletePath) {
          updatedFilePayloadList.splice(index,1);
        }
      });
    }
    for (let imageToDeleteUrl of this.imagesToDeleteUrlList) {
      post.files.forEach( (filePayload, index) => {
        if (filePayload.url === imageToDeleteUrl) {
          this.imagesToDeletePathList.push(filePayload.path);
          updatedFilePayloadList.splice(index,1);
        }
      });
    }
    for(let imageUrl of this.uploadedImagesMap.keys()) {
      let filePayload = new FilePayload(imageUrl, this.uploadedImagesMap.get(imageUrl) || '');
      console.log('filePayload.url - ' + filePayload.url)
      updatedFilePayloadList.push(filePayload)
    }
    return updatedFilePayloadList;
  }

  getAllPostsByUser(userName: string, pageNumber: number, postsPerPage: number): Observable<PostResponse> {
    return this.http.get<PostResponse>('http://localhost:8080/api/posts/by-user', {
      params: {
        userName: userName,
        pageNumber: pageNumber,
        postsPerPage: postsPerPage
      }
    });
  }

  deletePost(id: number): Observable<any> {
    console.log(this.localStorage.retrieve('authenticationToken'))
    return this.http.delete(`${this.postUrl}/${id}`);
  }

  addImageToUploadedImagesMap(imageUrl: string, imagePath: string) {
    console.log('Image added to uploaded map')
    this.uploadedImagesMap.set(imageUrl, imagePath);
  }

  getImagePathFromUploadedImagesMap(imageUrl: string): string {
    return this.uploadedImagesMap.get(imageUrl) || "";
  }

  addImageToImagePathListToDelete(imagePath: string) {
    console.log('Image added to images to delete list')
    this.imagesToDeletePathList.push(imagePath);
  }
}
