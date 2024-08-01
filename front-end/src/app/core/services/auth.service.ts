import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Employee } from '../models/employee.model';
import { Pacient } from '../models/pacient.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<Pacient | Employee>(null);

  constructor(private http: HttpClient) {}

  login(loginInfo: any) {
    return this.http.post<Pacient | Employee>('http://localhost:8080/login', loginInfo).pipe(tap(e => {
      if(e.id) {
        sessionStorage.setItem('userData', JSON.stringify(e));
      }
    }));
  }

  logout() {
    this.user.next(null);
    sessionStorage.removeItem('userData');
  }
  
  generatePasswordResetCode(email: string) {
    return this.http.post('http://localhost:8080/password/generate', {email});
  }

  resetPassword(resetInfo: any) {
    return this.http.post('http://localhost:8080/password/reset', resetInfo);
  }

  autoLogin() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    this.user.next(userData);
  }

  updateUser(newUser: Pacient | Employee) {
    this.user.next(newUser);
    sessionStorage.setItem('userData', JSON.stringify(newUser));
  }
}
