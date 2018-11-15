import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';

import { AuthService } from '../../system/services/auth.service';
import { MediaService } from '../../system/services/media.service';
import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';

import { Media } from '../../system/models/media';

const URL = '/api/upload/';

export interface QueueElement {
  alias: string;
  file: object;
  index: any;
  isCancel: boolean;
  isError: boolean;
  isReady: boolean;
  isSuccess: boolean;
  isUploaded: boolean;
  isUploading: boolean;
  progress: number;
  url: string;
  withCredentials: boolean;
}

@Component({
  selector: 'app-medias',
  templateUrl: './medias.component.html',
  styleUrls: ['./medias.component.scss']
})
export class MediasComponent implements OnInit {
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions: number[] = [5 ,10, 20, 50, 100];
  displayedColumns: string[] = ['title', 'content', 'createdAt', 'actions'];
  displayedQueueColumns: string[] = ['name', 'size', 'progress', 'status', 'actions'];
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  isLoading = true
  isRateLimitReached = false;
  isDsqRateLimitReached = false;
  media = new Media();
  medias: Media[] = [];
  dsQueue: QueueElement[] = [] 
  uploader:FileUploader;
  response:string;
  resultsLength = 0;
  resultsDsqLength = 0;
  dataSource: MatTableDataSource<Media>;
   pageEvent: PageEvent;
  dataSourceQueue = new MatTableDataSource(this.dsQueue);  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor (public auth: AuthService,
               private router: Router,
               public mediaService: MediaService,
               public snackbar: SnackBarComponent ) {
  }
  ngOnInit() {
    this.dataSourceQueue = new MatTableDataSource(this.dsQueue);  
    this.dataSourceQueue.sort = this.sort;    
    this.uploader = new FileUploader({url: URL+this.auth.currentUser._id, itemAlias: 'media'});
    this.uploader.onAfterAddingFile = (file)=> { 
      file.withCredentials = false;
      this.dsQueue = this.uploader.queue.map(function(queue) {
        return {
          alias: queue.alias,
          file: queue.file,
          index: queue.index,
          isCancel: queue.isCancel,
          isError: queue.isError,
          isReady: queue.isReady,
          isSuccess: queue.isSuccess,
          isUploaded: queue.isUploaded,
          isUploading: queue.isUploading,
          progress: queue.progress,
          url: queue.url,
          withCredentials: queue.withCredentials
        }
      })
      console.log(this.uploader.queue)
      this.dataSourceQueue = new MatTableDataSource(this.dsQueue);        
      this.dataSourceQueue.sort = this.sort;
      this.resultsDsqLength = this.uploader.queue.length;
    };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      let file = JSON.parse(response).file[0]
      this.media.title = file.originalname;
      this.media.content = file.filename;
      this.media.user = this.auth.currentUser;
      this.media.url = this.auth.currentUser._id + '/' + file.filename;
      this.addMedia()
      this.dsQueue = this.uploader.queue.map(function(queue) {
        return {
          alias: queue.alias,
          file: queue.file,
          index: queue.index,
          isCancel: queue.isCancel,
          isError: queue.isError,
          isReady: queue.isReady,
          isSuccess: queue.isSuccess,
          isUploaded: queue.isUploaded,
          isUploading: queue.isUploading,
          progress: queue.progress,
          url: queue.url,
          withCredentials: queue.withCredentials
        }
      })
      this.response = '';
    }
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.getMedias();
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addMedia() {
    this.mediaService.addMedia(this.media).subscribe(
      res => {
        //this.uploader = new FileUploader({url: URL+this.auth.currentUser._id, itemAlias: 'media'});
        this.getMedias();
        this.snackbar.setMessage('item added successfully.', 'success');
    })
  }

  clearQueue() {
    this.dsQueue = []
    this.dataSourceQueue = new MatTableDataSource(this.dsQueue);            
  }

  clearQueueItem() {
    this.dsQueue = this.uploader.queue.map(function(queue) {
        return {
          alias: queue.alias,
          file: queue.file,
          index: queue.index,
          isCancel: queue.isCancel,
          isError: queue.isError,
          isReady: queue.isReady,
          isSuccess: queue.isSuccess,
          isUploaded: queue.isUploaded,
          isUploading: queue.isUploading,
          progress: queue.progress,
          url: queue.url,
          withCredentials: queue.withCredentials
        }
      })
    this.dataSourceQueue = new MatTableDataSource(this.dsQueue);            
  }

  deleteMedia(media: Media) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.mediaService.deleteMedia(media).subscribe(
        () => {
          this.getMedias();
          this.snackbar.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  getMedias() {
    this.mediaService.getMedias({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.medias = data;  
        this.dataSource = new MatTableDataSource(data);        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultsLength = data.length;
        this.isLoading = false;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    this.getMedias() 
  }
}
