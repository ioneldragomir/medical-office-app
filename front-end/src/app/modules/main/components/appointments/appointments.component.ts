import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { add, startOfToday } from 'date-fns';

import { MessageService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { specialties } from 'src/app/core/constants/specialties';
import { Appointment } from 'src/app/core/models/appointment.model';
import { Employee } from 'src/app/core/models/employee.model';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointmentForm: FormGroup;

  specialtyOptions = [];

  doctors: Employee[];
  doctorsOptions = [];
  doctorsSubscription: Subscription;

  minDateValue: Date;

  constructor(
    private messageService: MessageService,
    private employeesService: EmployeeService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.specialtyOptions.push(...specialties);
  
    this.doctorsSubscription = this.employeesService.getEmployees({
      type: 'doctor'
    }).subscribe({
      next: (v) => {
        this.doctors = v;

        this.updateDoctorOptions(v);
      },
    });

    this.minDateValue = add(startOfToday(), { days: 5 });
  }

  private initForm() {
    this.appointmentForm = new FormGroup({
      pacientDetails: new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(48),
        ]),
        phoneNumber: new FormControl(null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ])
      }),
      appointmentDetails: new FormGroup({
        specialty: new FormControl(null),
        doctor: new FormControl(null, Validators.required),
        date: new FormControl(null, Validators.required),
        message: new FormControl(null),
      }),
    });
  }

  get name() {
    return this.appointmentForm.get('pacientDetails.name');
  }
  get phoneNumber() {
    return this.appointmentForm.get('pacientDetails.phoneNumber');
  }
  get doctor() {
    return this.appointmentForm.get('appointmentDetails.doctor');
  }
  get date() {
    return this.appointmentForm.get('appointmentDetails.date');
  }
  get message() {
    return this.appointmentForm.get('appointmentDetails.message');
  }
  get specialty() {
    return this.appointmentForm.get('appointmentDetails.specialty');
  }

  updateDoctorOptions(doctors: Employee[]) {
    this.doctorsOptions = [];
    doctors.forEach((doctor) => {
      this.doctorsOptions.push({
        name: doctor.lastName + ' ' + doctor.firstName,
        code: doctor.id,
      });
    });
  }

  onUpdateDoctors() {
    if(this.specialty.value) {
      this.updateDoctorOptions(this.doctors.filter( e => e.specialty === this.specialty.value.code));
    } else {
      this.updateDoctorOptions(this.doctors);
    }
   
  }

  onSubmit() {
    if (!this.appointmentForm.valid) {
      this.name.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.doctor.markAsTouched();
      this.date.markAsTouched();

      return;
    }

    const appointmentInfo: Appointment = {
      name: this.name.value,
      phoneNumber: this.phoneNumber.value,
      doctorId: this.doctor.value.code,
      date: this.date.value.toLocaleString('ro-Ro'),
      message: this.message.value,
    };

    for (const key in appointmentInfo) {
      if (Object.prototype.hasOwnProperty.call(appointmentInfo, key)) {
        const value = appointmentInfo[key];
        if (!value) {
          delete appointmentInfo[key];
        }
      }
    }

    this.appointmentForm.disable();

    this.appointmentService.postAppointment(appointmentInfo).subscribe({
      next: (v: any) => {
        this.appointmentForm.reset();
        this.appointmentForm.enable();
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: v.success,
          life: 5000,
        });
      },
      error: (e) => {
        this.appointmentForm.reset();
        this.appointmentForm.enable();
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: e.error.error,
          life: 5000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.doctorsSubscription.unsubscribe();
  }
}
