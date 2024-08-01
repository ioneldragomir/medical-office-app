import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';

@Injectable({providedIn: 'root'})
export class ContactService {
  constructor(private http: HttpClient) { }
  
  postContactMessage(contactInfo: Contact) {
    return this.http.post<Contact>('http://localhost:8080/api/contact', contactInfo);
  }

  getContactMessage() {
    return this.http.get<Contact[]>('http://localhost:8080/api/contact');
  }

  deleteContactMessage(id: string) {
    return this.http.delete(`http://localhost:8080/api/contact/${id}`);
  }

  deleteContactMessages(messagesToDelete: any) {
    return this.http.put('http://localhost:8080/api/contact', messagesToDelete);
  }

  updateContactMessages(contactInfo: Contact, id: string) {
    return this.http.put(`http://localhost:8080/api/contact/${id}`, contactInfo);
  }
}