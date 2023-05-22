import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PostService } from './post/post.service';
import { Post } from './post/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts : any = [];
  showLoading = false;
  error = null;
  errSub!: Subscription;

  @Input()
  tempEditData: any = {
    id: '',
    title : '',
    content : ''
  }
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.errSub = this.postService.errorHandling.subscribe(
      err => {
        this.error = err;
      }
    )

    this.fetchPosts();
  }

  ngOnDestroy(): void {
    this.errSub.unsubscribe();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    this.postService.createPostService(postData);
  }

  onUpdatePost(editData: { id: string, title: string; content: string }){
    this.postService.updatePostService(editData);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.clearPostService().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    )

  }

  onDeleteByIdPost(id: string) {
    // this.showLoading = true;
    console.log('id delete:' + id);

    this.postService.deleteByIdPostService(id);
    // .subscribe(
    //   (data) => {
    //     this.showLoading = false;
    //     this.fetchPosts();
    //   }
    // );

  }

  onEditForm(data: Post) {
    console.log(data);

    this.tempEditData.id = data.id;
    this.tempEditData.title = data.title;
    this.tempEditData.content = data.content

    console.log(this.tempEditData);

  }

  private fetchPosts() {
    // this.http.get(this.postURL).subscribe(
    //   posts => {
    //     console.log( posts);

    //   }
    // )
    this.showLoading = true;
    this.postService.fetchPostService()
    .subscribe(
      posts => {
        this.showLoading = false;

        // console.log(posts);
        this.loadedPosts = posts;
        // console.log(this.loadedPosts);
      },
      err => {
        console.log(err);
        this.error = err;

      }
    )
  }

}
