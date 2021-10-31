import {Component, HostListener, OnInit} from '@angular/core';
import {throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PostService} from "../../../services/post.service";
import {TopicService} from "../../../services/topic.service";
import {TopicModel} from "../../../model/topic-model";
import {PostPayload} from "../../../model/post-payload";
import '@tinymce/tinymce-angular';
import {AuthService} from "../../../services/auth.service";
import {ImageService} from "../../../services/image.service";
import {ImageDeleteRequest} from "../../../model/image-delete-request";
import {FilePayload} from "../../../model/file-payload";

declare var tinymce: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  createPostForm: FormGroup;
  postPayload: PostPayload;
  topics: Array<TopicModel>;
  orderType: string = 'new'
  pageNumber: number = 0
  postsPerPage: number = 10
  tinymceInit: any

  constructor(private router: Router, private postService: PostService,
              private topicService: TopicService, authService: AuthService) {

    this.postPayload = {
      postName: '',
      //url: '',
      description: '',
      topicId: 0
    }


    this.tinymceInit = {
      plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor colorpicker textpattern"
      ],
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | image |',
      automatic_uploads: true,
      images_upload_handler: function (blobInfo: any, success: any, failure: any) {
        uploadImageToServer(blobInfo, success, failure);
      },
      setup: function (ed: any) {
        deleteUploadedImagesFromServerOnEditorDestroy(ed);
        deleteImageFromEditor(ed);
      }
    }

    let deleteImageFromEditor = function (ed: any) {
      ed.on('KeyDown', (e: any) => {
        if ((e.keyCode == 8 || e.keyCode == 46) && tinymce.activeEditor.selection) { // delete & backspace keys
          var selectedNode = tinymce.activeEditor.selection.getNode(); // get the selected node (element) in the editor
          if (selectedNode && selectedNode.nodeName == 'IMG') {
            let imageToDeletePath = postService.getImagePathFromUploadedImagesMap(selectedNode.src)
            postService.addImageToImagePathListToDelete(imageToDeletePath)
            postService.uploadedImagesMap.delete(selectedNode.src);
          }
        }
      });
    }

    let deleteUploadedImagesFromServerOnEditorDestroy = function (ed: any) {
      ed.on('remove', (e: any) => {
        console.log('The Editor has been destroyed.');
        postService.imagesToDeletePathList = [...postService.imagesToDeletePathList, ...postService.uploadedImagesMap.values()];
        postService.deleteImagesFromServer()
      });
    }

    let uploadImageToServer = function (blobInfo: any, success: any, failure: any) {
      var image_size = blobInfo.blob().size / 1000;  // image size in kbytes
      console.log('type - ' + blobInfo.blob().type)
      var max_size = 100                // max size in kbytes
      if (image_size > max_size) {
        failure('Image is too large( ' + image_size + ') ,Maximum image size is:' + max_size + ' kB');
        return;
      }
      var selectedNode = tinymce.activeEditor.selection.getNode(); // get the selected node (element) in the editor
      if (selectedNode && selectedNode.nodeName == 'IMG') {
        postService.imagesToDeletePathList.push(postService.getUploadedImagePath(selectedNode.src))
        postService.uploadedImagesMap.delete(selectedNode.src)
      }
      var xhr: XMLHttpRequest, formData;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', 'http://localhost:8080/api/media/image/upload');
      xhr.setRequestHeader('Authorization', authService.getJwtToken())

      xhr.onload = function () {
        var json;
        if (xhr.status != 200) {
          failure('Error: ' + +xhr.status + ' Something went wrong!');
          //failure('HTTP Error: ' + xhr.status);
          return;
        }
        if (xhr.responseText == null || xhr.responseText.indexOf(",") == -1) {
          failure('Error: ' + +xhr.status + ' Something went wrong!');
          return;
        }

        json = handleImageResponse(xhr.responseText);
        success(json);
      };
      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    }

    let handleImageResponse = function (responseText: string): string {
      let imgPath = responseText.substr(responseText.indexOf(","), responseText.length).replace(",", "");
      let imgUrl = responseText.substr(0, responseText.indexOf(",")).replace(",", "");
      postService.addImageToUploadedImagesMap(imgUrl, imgPath);
      return imgUrl;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent) {
    console.log('BeforeUnload listener triggered')
    this.postService.imagesToDeletePathList = [...this.postService.imagesToDeletePathList, ...this.postService.uploadedImagesMap.values()];
    this.postService.deleteImagesFromServer()
  }


  ngOnInit() {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      topicId: new FormControl(0, Validators.required),
      url: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.topicService.getAllTopics(this.orderType, this.pageNumber, this.postsPerPage).subscribe((data) => {
      this.topics = data.topics;
    }, error => {
      throwError(error);
    });


  }

  // uploadImagesToServer = function () {
  //   tinymce.activeEditor.uploadImages()
  // }

  createPost() {

    this.postPayload.postName = this.createPostForm.get('postName')!.value;
    this.postPayload.topicId = this.createPostForm.get('topicId')!.value;
    //this.postPayload.url = this.createPostForm.get('url').value;
    this.postPayload.description = this.createPostForm.get('description')!.value;

    this.postService.createPost(this.postPayload).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, error => {
      throwError(error);
    })
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }
}
