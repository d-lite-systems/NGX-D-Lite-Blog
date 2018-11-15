import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media } from '../models/media';

@Injectable({
  providedIn: 'root'
})

export class MediaService {

  constructor(private http: HttpClient) { }

  getMedias(query: any): Observable<Media[]> {
    return this.http.get<Media[]>('/api/medias?currentPage='+query.currentPage+'&perPage='+query.perPage);
  }

  countMedias(): Observable<number> {
    return this.http.get<number>('/api/medias/count');
  }

  addMedia(media: Media): Observable<Media> {
    return this.http.post<Media>('/api/media', media);
  }

  getMedia(media: Media): Observable<Media> {
    return this.http.get<Media>(`/api/media/${media._id}`);
  }

  editMedia(media: Media): Observable<any> {
    return this.http.put(`/api/media/${media._id}`, media, { responseType: 'text' });
  }

  deleteMedia(media: Media): Observable<any> {
    return this.http.delete(`/api/media/${media._id}`, { responseType: 'text' });
  }

}
