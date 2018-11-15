import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(query: any): Observable<Article[]> {

    return this.http.get<Article[]>('/api/articles?currentPage='+query.currentPage+'&perPage='+query.perPage);
  }

  countArticles(): Observable<number> {
    return this.http.get<number>('/api/articles/count');
  }

  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>('/api/article', article);
  }

  getArticle(article: Article): Observable<Article> {
    return this.http.get<Article>(`/api/article/${article._id}`);
  }

  editArticle(article: Article): Observable<any> {
    return this.http.put(`/api/article/${article._id}`, article, { responseType: 'text' });
  }

  deleteArticle(article: Article): Observable<any> {
    return this.http.delete(`/api/article/${article._id}`, { responseType: 'text' });
  }

}
