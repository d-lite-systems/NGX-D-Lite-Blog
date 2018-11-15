import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(query: any): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks?currentPage='+query.currentPage+'&perPage='+query.perPage);
  }

  countTasks(): Observable<number> {
    return this.http.get<number>('/api/tasks/count');
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>('/api/task', task);
  }

  getTask(task: Task): Observable<Task> {
    return this.http.get<Task>(`/api/task/${task._id}`);
  }

  editTask(task: Task): Observable<any> {
    return this.http.put(`/api/task/${task._id}`, task, { responseType: 'text' });
  }

  deleteTask(task: Task): Observable<any> {
    return this.http.delete(`/api/task/${task._id}`, { responseType: 'text' });
  }

}
