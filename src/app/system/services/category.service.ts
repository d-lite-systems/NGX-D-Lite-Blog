import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(query: any): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories?currentPage='+query.currentPage+'&perPage='+query.perPage);
  }

  countCategories(): Observable<number> {
    return this.http.get<number>('/api/categories/count');
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>('/api/category', category);
  }

  getCategory(category: Category): Observable<Category> {
    return this.http.get<Category>(`/api/category/${category._id}`);
  }

  editCategory(category: Category): Observable<any> {
    return this.http.put(`/api/category/${category._id}`, category, { responseType: 'text' });
  }

  deleteCategory(category: Category): Observable<any> {
    return this.http.delete(`/api/category/${category._id}`, { responseType: 'text' });
  }

}
