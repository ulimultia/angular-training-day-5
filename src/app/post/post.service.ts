import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  endPointURL: string = 'https://angular-training-834e1-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL +'post.json';
  updateURL: string = this.endPointURL + 'post/';
  errorHandling = new Subject<any>();

  constructor(private http: HttpClient) {}

  createPostService(postData: Post){
    this.http.post(this.postURL, postData).subscribe( (data) => {
      console.log(data);
    })
  }

  updatePostService(editData: Post) {

    this.http.put(this.updateURL+editData.id+'.json', editData).subscribe((data) => {
      console.log(data);
    })
  }

  fetchPostService(){
    let customParam = new HttpParams();
    customParam = customParam.append('print', 'pretty');
    customParam = customParam.append('custom-param', 'custom-param-value');

    return this.http.get<{[key: string] : Post}>(this.postURL, {
      headers: new HttpHeaders({
        'custom-header' : 'hello custom header'
      }),
      params: customParam,
    })
    .pipe(
      map( respData => {
        const postArray = [];
        for(const key in respData){
          // console.log(key);
          if(respData.hasOwnProperty(key)){
            postArray.push({...respData[key],
               id: key
            })
          }
        }
        return postArray;
      }),
      catchError(
        errorRes => {
          return throwError(errorRes);
        }
      )
    );
  }

  clearPostService(){
    return this.http.delete(this.postURL);
  }

  deleteByIdPostService(id : string){
    console.log(this.updateURL+id+'.json');

    this.http.delete(this.updateURL+id+'.json');
  }




}
