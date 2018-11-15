import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})

export class ContactService {

  constructor(private http: HttpClient) { }

  getContacts(query: any): Observable<Contact[]> {

    return this.http.get<Contact[]>('/api/contacts?currentPage='+query.currentPage+'&perPage='+query.perPage);
  }

  countContacts(): Observable<number> {
    return this.http.get<number>('/api/contacts/count');
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>('/api/contact', contact);
  }

  getContact(contact: Contact): Observable<Contact> {
    return this.http.get<Contact>(`/api/contact/${contact._id}`);
  }

  editContact(contact: Contact): Observable<any> {
    return this.http.put(`/api/contact/${contact._id}`, contact, { responseType: 'text' });
  }

  deleteContact(contact: Contact): Observable<any> {
    return this.http.delete(`/api/contact/${contact._id}`, { responseType: 'text' });
  }

}
