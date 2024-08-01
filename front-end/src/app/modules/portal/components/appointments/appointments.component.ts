import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { appointmentStatus } from 'src/app/core/constants/appointmentStatus';
import { Appointment } from 'src/app/core/models/appointment.model';
import { Employee } from 'src/app/core/models/employee.model';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { PacientService } from 'src/app/core/services/pacient.service';
import { formatDate } from 'src/app/shared/functions/formatDate';

@Component({
  selector: 'app-portal-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('dtPacients') dtPacients: Table | undefined;
  defaultDate: Date = null;

  isLoading = false;  
  numberOfCols = 6;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  selectedItem = null;
  isDialogVisible = false;
  dialogHeader = 'Informații';
  appointmentStatusOptions = null;
  doctorsOptions = null;
  doctors: Employee[];

  appointmentForm: FormGroup;
  mode = 'view';

  pacients = [];
  user = null;

  selectedPacient = null;

  filterPacientId = null;

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeeService,
    private authService: AuthService,
    private http: HttpClient,
    private pacientService: PacientService
  ) {}

  ngOnInit(): void {
    this.pacientService.getPacients().subscribe({
      next: (e) => {
        this.pacients = e;
        this.isLoading = false;
      },
    });

    this.defaultDate = new Date();
    this.defaultDate.setHours(8);
    this.defaultDate.setMinutes(0);
    this.defaultDate.setSeconds(0);
    this.user = this.authService.user.getValue();

    this.appointmentStatusOptions = [...appointmentStatus];
    this.employeesService
      .getEmployees({
        type: 'doctor',
      })
      .subscribe({
        next: (v) => {
          this.doctors = v;

          this.updateDoctorOptions(v);
        },
      });

    const params = {};
    if (this.user.type === 'pacient' ) {
      params['pacientId'] = this.user.id;
    }
    if (history.state.data) {
      params['pacientId'] = history.state.data;
      this.filterPacientId = history.state.data;
    }
    if (this.user.type === 'doctor') {
      params['doctorId'] = this.user.id;
    }

    this.appointmentService.getAppointments(params).subscribe({
      next: (e) => {
        this.appointments = e;
        this.filteredAppointments = e;
        this.isLoading = false;
      },
    });

    this.initForm();
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

  private initForm() {
    this.appointmentForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(48),
      ]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ]),
      date: new FormControl(null, Validators.required),
      message: new FormControl(null),
      status: new FormControl(null),
      doctor: new FormControl(null, Validators.required),
    });   
  }

  get name() {
    return this.appointmentForm.get('name');
  }
  get phoneNumber() {
    return this.appointmentForm.get('phoneNumber');
  }
  get date() {
    return this.appointmentForm.get('date');
  }
  get message() {
    return this.appointmentForm.get('message');
  }
  get status() {
    return this.appointmentForm.get('status');
  }
  get doctor() {
    return this.appointmentForm.get('doctor');
  }

  filterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterGlobalType($event) {
    if ($event.value) {
      this.filteredAppointments = this.appointments.filter(
        (m) => m.status === $event.value.code
      );
    } else {
      this.filteredAppointments = [...this.appointments];
    }
  }

  toggleAddEmployee() {
    this.isDialogVisible = true;
    this.dialogHeader = 'Adăugare';
    this.mode = 'add';

    this.appointmentForm.reset();
    this.appointmentForm.enable();
  }

  viewItem(item: Appointment) {
    this.dialogHeader = 'Informații';
    this.selectedItem = item;
    this.mode = 'view';
    this.appointmentForm.disable();
    this.isDialogVisible = true;

    const doctor = this.doctorsOptions.filter((d) => d.code === item.doctorId);
    console.log(doctor);

    this.appointmentForm.patchValue({
      name: item.name,
      phoneNumber: item.phoneNumber,
      date: formatDate(item.date),
      doctor: doctor ? doctor[0] : 'Nu există doctor',
      message: item.message,
      status: this.appointmentStatusOptions.filter(
        (e) => e.code === item.status
      )[0],
    });
  }

  deleteItem(item: Appointment) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți acestă programare?',
      accept: () => {
        this.appointmentService.deleteAppointment(item.id).subscribe({
          next: (v: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: v.success,
              life: 3000,
            });
            this.appointments = this.appointments.filter(
              (m) => m.id !== item.id
            );
            this.filteredAppointments = [...this.appointments];
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: e.error.error,
              life: 3000,
            });
          },
        });
      },
    });
  }

  onToggleEdit() {
    this.dialogHeader = 'Modificare';
    this.mode = 'edit';
    this.appointmentForm.enable();
  }

  onCancelEdit() {
    this.mode = 'view';
    this.appointmentForm.disable();
    this.dialogHeader = 'Informații';
  }

  onSubmit() {
    if (!this.appointmentForm.valid) {
      this.name.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.date.markAsTouched();
      this.status.markAsTouched();
      this.message.markAsTouched();
      return;
    }

    const appointmentInfo: Appointment = {
      name: this.name.value,
      phoneNumber: this.phoneNumber.value,
      date: this.date.value.toLocaleString('ro-Ro'),
      doctorId: this.doctor.value.code,
      status: this.status.value ? this.status.value.code : 'programat',
      message: this.message.value ? this.message.value : null,
    };

    this.appointmentForm.disable();

    let service = null;

    if (this.mode === 'add') {
      service = this.appointmentService.postAppointment(appointmentInfo);
    } else if (this.mode === 'edit') {
      service = this.appointmentService.updateAppointment(
        appointmentInfo,
        this.selectedItem.id
      );
    }

    service.subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail:
            this.mode === 'add'
              ? 'Programarea a fost adăugat cu success.'
              : 'Programarea a fost modificat cu success.',
          life: 5000,
        });
        if (this.mode === 'add') {
          this.appointments.unshift(v);
          this.filteredAppointments = [...this.appointments];
        } else if (this.mode === 'edit') {
          this.appointments[this.appointments.indexOf(this.selectedItem)] = v;
          this.filteredAppointments = [...this.appointments];
        }
        this.isDialogVisible = false;
        this.dialogHeader = 'Informații';
        this.mode = 'view';
        this.appointmentForm.reset();
        this.appointmentForm.enable();
      },
      error: (e) => {
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

  uploadFile(event, ref) {
    const file = event.files[0];

    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`http://localhost:8080/api/file/${this.selectedItem.id}`, formData).subscribe({
      next: (d: any) => {
        this.selectedItem.file = d.file;
        ref.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Fișierul a fost încărcat cu succes.',
          life: 5000,
        });
      }
    })
  }

  getFile() {
    this.http.get(`http://localhost:8080/api/file/${this.selectedItem.id}`).subscribe({
      next: (d: any) => {
        if (!d) {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Nu există nici un fișier pentru programarea selectată.',
            life: 5000,
          });
          return;
        }
        
        const file = new Blob([new Uint8Array(d.data)], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  deleteFile() {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să eliminați fișierul salvat? Nu se mai poate recupera!',
      accept: () => {
        this.http.delete(`http://localhost:8080/api/file/${this.selectedItem.id}`).subscribe({
          next: (d: any) => {
            this.selectedItem.file = null;
            this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail: 'Fișierul a fost eliminat.',
                life: 5000,
              });
          },
          error: (e) => {
            this.appointmentForm.enable();
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: e.error.error,
              life: 5000,
            });
          },
        })
      },
    });
    
  }

  uploadAppointmentFile(event, ref) {
    const file = event.files[0];

    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`http://localhost:8080/api/appointment_file/${this.selectedItem.id}`, formData).subscribe({
      next: (d: any) => {
        this.selectedItem.appointmentFile = d.appointmentFile;
        ref.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Fișierul a fost încărcat cu succes.',
          life: 5000,
        });
      }
    })
  }

  getAppointmentFile() {
    this.http.get(`http://localhost:8080/api/appointment_file/${this.selectedItem.id}`).subscribe({
      next: (d: any) => {
        if (!d) {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Nu există nici un fișier pentru programarea selectată.',
            life: 5000,
          });
          return;
        }
        
        const file = new Blob([new Uint8Array(d.data)], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  deleteAppointmentFile() {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să eliminați fișierul salvat? Nu se mai poate recupera!',
      accept: () => {
        this.http.delete(`http://localhost:8080/api/appointment_file/${this.selectedItem.id}`).subscribe({
          next: (d: any) => {
            this.selectedItem.appointmentFile = null;
            this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail: 'Fișierul a fost eliminat.',
                life: 5000,
              });
          },
          error: (e) => {
            this.appointmentForm.enable();
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: e.error.error,
              life: 5000,
            });
          },
        })
      },
    });
    
  }

  getPacientNameFromId(id: string) {
    let name = '';

    this.pacients.forEach(p => {
      if(p.id === id) {
        name = p.lastName + ' ' + p.firstName;
      }
    })

    return name;
  }

  getPacientObjectFromId(id: string) {
    let pacinet = null;

    this.pacients.forEach(p => {
      if(p.id === id) {
        pacinet = p;
      }
    })

    return pacinet;
  }

  onRowSelect(event) {
    this.selectedItem.pacientId = event.data.id;
    
    this.appointmentService.updateAppointment(this.selectedItem, this.selectedItem.id).subscribe({
      next: p => {
        this.messageService.add({severity: 'success', summary: 'Succes', detail: `Ați ales ${event.data.lastName} ${event.data.firstName}`});
      },
      error: (e) => {
        this.selectedItem.pacientId = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: e.error.error,
          life: 5000,
        });
      },
    })
  }

  deleteAppointmentPacient() {
    const prevValue = this.selectedItem.pacientId;
    this.selectedItem.pacientId = null;
    this.selectedPacient = null;
    this.appointmentService.updateAppointment(this.selectedItem, this.selectedItem.id).subscribe({
      next: p => {
        this.messageService.add({severity: 'success', summary: 'Succes', detail: 'Pacentul a fost decuplat de la programare.'});
      },
      error: (e) => {
        this.selectedItem.pacientId = prevValue;
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: e.error.error,
          life: 5000,
        });
      },
    })
  }

  filterGlobalPacients($event, stringVal) {
    this.dtPacients.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilterPacient() {
    this.appointmentService.getAppointments().subscribe({
      next: (e) => {
        this.filterPacientId = null;
        this.appointments = e;
        this.filteredAppointments = e;
        this.isLoading = false;
      },
    });

  }
}
