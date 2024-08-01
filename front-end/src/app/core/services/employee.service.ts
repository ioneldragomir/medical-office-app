import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { searchParams } from 'src/app/shared/functions/searchParams';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(params?) {
    return this.http.get<Employee[]>('http://localhost:8080/api/employees', {
      params: searchParams(params),
    });
  }

  updateEmployee(employeeInfo: Employee, id: string) {
    return this.http.put<Employee>(`http://localhost:8080/api/employees/${id}`, employeeInfo);
  }

  postEmployee(employeeInfo: Employee) {
    return this.http.post<Employee>('http://localhost:8080/api/employees', employeeInfo);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`http://localhost:8080/api/employees/${id}`);
  }
}


