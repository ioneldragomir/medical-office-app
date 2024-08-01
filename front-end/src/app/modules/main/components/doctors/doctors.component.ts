import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { hierarchies } from 'src/app/core/constants/hierarchies';
import { specialties } from 'src/app/core/constants/specialties';
import { Employee } from 'src/app/core/models/employee.model';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements OnInit {
  filterForm: FormGroup;

  doctors: Employee[] = [];
  filteredDoctors: Employee[] = [];
  doctorsSubscription: Subscription = null;

  specialtyOptions = [];
  hierarchyOptions = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initForm();

    this.specialtyOptions.push(...specialties);
    this.hierarchyOptions.push(...hierarchies);

    const params = {type: 'doctor'}
    this.doctorsSubscription = this.employeeService.getEmployees(params).subscribe({
      next: (v) => {
        this.doctors = v;
        this.filteredDoctors = v;
      },
    });
  }

  private initForm() {
    this.filterForm = new FormGroup({
        specialty: new FormControl(null),
        hierarchy: new FormControl(null),
        name: new FormControl(null),
    });
  }

  getFullName(lastName: string, firstName: string) : string {
    return `${lastName} ${firstName}`
  }

  get specialty() {
    return this.filterForm.get('specialty');
  }
  get hierarchy() {
    return this.filterForm.get('hierarchy');
  }
  get name() {
    return this.filterForm.get('name');
  }

  onSubmit() {
    let filters = {specialty: true, hierarchy: true, name: true}


    this.filteredDoctors = this.doctors.filter(e => {
      if(this.specialty.value && !(e.specialty === this.specialty.value.code)) {
        filters.specialty = false;
      } else {
        filters.specialty = true;
      }
     
      if(this.hierarchy.value && !(e.hierarchy === this.hierarchy.value.code)) {
        filters.hierarchy = false;
      } else {
        filters.hierarchy = true;
      }

      if(this.name.value && !(this.getFullName(e.lastName, e.firstName).toLowerCase().includes(this.name.value.toLowerCase()))) {
        filters.name = false;
      } else {
        filters.name = true;
      }

      return  filters.specialty && filters.hierarchy && filters.name;
    }
    );
  }
}
