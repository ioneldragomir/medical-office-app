import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pacient } from '../models/pacient.model';

@Injectable({providedIn: 'root'})
export class PacientService {
  constructor(private http: HttpClient) { }
  
  postPacient(pacientInfo: Pacient) {
    return this.http.post<Pacient>('http://localhost:8080/api/pacients', pacientInfo);
  }

  updatePacient(pacientInfo: Pacient, id: string) {
    return this.http.put<Pacient>(`http://localhost:8080/api/pacients/${id}`, pacientInfo);
  }

  getPacients() {
    return this.http.get<Pacient[]>('http://localhost:8080/api/pacients');
  }

  deletePacient(id: string) {
    return this.http.delete(`http://localhost:8080/api/pacients/${id}`);
  }

  postPacientPortal(pacientInfo: Pacient) {
    return this.http.post<Pacient>('http://localhost:8080/api/pacients/portal', pacientInfo);
  }

}