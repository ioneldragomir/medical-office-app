import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { searchParams } from 'src/app/shared/functions/searchParams';
import { Appointment } from '../models/appointment.model';

@Injectable({providedIn: 'root'})
export class AppointmentService {
  constructor(private http: HttpClient) { }
  
  postAppointment(appointmentInfo: Appointment) {
    return this.http.post<Appointment>('http://localhost:8080/api/appointments', appointmentInfo);
  }
  
  getAppointments(params?) {
    return this.http.get<Appointment[]>('http://localhost:8080/api/appointments', {
      params: searchParams(params),
    });
  }

  updateAppointment(appointmentInfo: Appointment, id: string) {
    return this.http.put<Appointment>(`http://localhost:8080/api/appointments/${id}`, appointmentInfo);
  }

  deleteAppointment(id: string) {
    return this.http.delete(`http://localhost:8080/api/appointments/${id}`);
  }
}