import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { hierarchies } from 'src/app/core/constants/hierarchies';
import { specialties } from 'src/app/core/constants/specialties';
import { Employee } from 'src/app/core/models/employee.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { formatDate } from 'src/app/shared/functions/formatDate';

@Component({
  selector: 'app-portal-doctors',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  isLoading = false;
  numberOfCols = 6;
  typeOptions = [
    { name: 'Admin', code: 'admin' },
    { name: 'Medic', code: 'doctor' },
    { name: 'Receptionist', code: 'receptionist' },
  ];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedItem = null;

  isDialogVisible = false;
  dialogHeader = 'Informații';

  employeeForm: FormGroup;
  mode = 'view'
  specialtyOptions = [];
  hierarchyOptions = [];

  user = null;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    this.specialtyOptions.push(...specialties);
    this.hierarchyOptions.push(...hierarchies);

    const params = {};
    if(this.user.type !== 'admin') {
      params['type'] = 'doctor';
    }

    this.isLoading = true;
    this.employeeService.getEmployees(params).subscribe({
      next: (e) => {
        this.employees = e;
        this.filteredEmployees = e;
        this.isLoading = false;
      },
    });

    this.initForm();
  }

  private initForm() {
    this.employeeForm = new FormGroup({
      common: new FormGroup({
        lastName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(24),
        ]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(24),
        ]),
        phoneNumber: new FormControl(null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(52),
        ]),
        cnp: new FormControl(null, [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ]),
        type: new FormControl(null, [
          Validators.required
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ]),
        date: new FormControl(null, Validators.required),
        address: new FormControl(null, [
          Validators.maxLength(72),
        ]),
        education: new FormControl(null, [
          Validators.maxLength(42),
        ]),
        experience: new FormControl(null, [
          Validators.maxLength(2),
          Validators.pattern('^[0-9]*$'),
        ]),
      }),
      doctorsOnly: new FormGroup({
        parafa: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
        hierarchy: new FormControl(null, Validators.required,),
        specialty: new FormControl(null, [Validators.maxLength(42), Validators.required]),
      })
    });

    this.employeeForm.get('doctorsOnly').disable();
  }

  get lastName() {
    return this.employeeForm.get('common.lastName');
  }
  get firstName() {
    return this.employeeForm.get('common.firstName');
  }
  get phoneNumber() {
    return this.employeeForm.get('common.phoneNumber');
  }
  get email() {
    return this.employeeForm.get('common.email');
  }
  get cnp() {
    return this.employeeForm.get('common.cnp');
  }
  get type() {
    return this.employeeForm.get('common.type');
  }
  get address() {
    return this.employeeForm.get('common.address');
  }
  get password() {
    return this.employeeForm.get('common.password');
  }
  get date() {
    return this.employeeForm.get('common.date');
  }
  get education() {
    return this.employeeForm.get('common.education');
  }
  get experience() {
    return this.employeeForm.get('common.experience');
  }
  get parafa() {
    return this.employeeForm.get('doctorsOnly.parafa');
  }
  get hierarchy() {
    return this.employeeForm.get('doctorsOnly.hierarchy');
  }
  get specialty() {
    return this.employeeForm.get('doctorsOnly.specialty');
  }

  filterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterGlobalType($event) {
    if ($event.value) {
      this.filteredEmployees = this.employees.filter(m => m.type === $event.value.code)
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  toggleAddEmployee() {
    this.isDialogVisible = true;
    this.dialogHeader = 'Adăugare'
    this.mode = 'add';

    this.employeeForm.reset(); 
    this.employeeForm.enable(); 
    this.employeeForm.get('doctorsOnly').disable(); 

    (this.employeeForm.get('common') as FormGroup).addControl('password',this.formBuilder.control(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(32),
    ]) );
  }

  addDoctorControls(event: any) {
    if(!event.value || event.value.code !== 'doctor') {
      this.employeeForm.get('doctorsOnly').reset();
      this.employeeForm.get('doctorsOnly').disable();
    } else {
      this.employeeForm.get('doctorsOnly').enable();
    }
  }

  onCancelEdit() {
    this.mode = 'view';
    this.employeeForm.disable();
    this.dialogHeader = 'Informații';
  }

  onToggleEdit() {
    this.dialogHeader = 'Modificare';
    this.mode = 'edit';
    this.employeeForm.enable();

    if(this.selectedItem.type !== 'doctor') {
      this.employeeForm.get('doctorsOnly').disable();
    }
  }

  viewItem(item: Employee) {
    this.dialogHeader = 'Informații';
    this.selectedItem = item;
    this.mode = 'view';
    this.employeeForm.disable();
    this.isDialogVisible = true;

    (this.employeeForm.get('common') as FormGroup).removeControl('password');
      
    this.employeeForm.patchValue({
      common: {
        lastName: item.lastName,
        firstName: item.firstName,
        cnp: item.cnp,
        email: item.email,
        date: formatDate(item.employmentDate),
        phoneNumber: item.phoneNumber,
        type: this.typeOptions.filter(e => e.code === item.type)[0],
        address: item.address,
        education: item.education,
        experience: item.experience,
      }, 
      doctorsOnly: {
        parafa: item.parafa,
        specialty: this.specialtyOptions.filter(e => e.code === item.specialty)[0],
        hierarchy: this.hierarchyOptions.filter(e => e.code === item.hierarchy)[0],
      }
    })
  }

  deleteItem(item: Employee) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți acest angajat?',
      accept: () => {
        this.employeeService.deleteEmployee(item.id).subscribe({
          next: (v: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: v.success,
              life: 3000,
            });
            this.employees = this.employees.filter(
              m => m.id !== item.id
            );
            this.filteredEmployees = [...this.employees];
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

  onSubmit() {
  
    if (!this.employeeForm.valid) {
      this.lastName.markAsTouched();
      this.firstName.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.email.markAsTouched();
      this.cnp.markAsTouched();
      this.type.markAsTouched();
      this.address.markAsTouched();
      if(this.password) this.password.markAsTouched();
      this.date.markAsTouched();
      this.education.markAsTouched();
      this.experience.markAsTouched();

      this.parafa.markAsTouched();
      this.specialty.markAsTouched();
      this.hierarchy.markAsTouched();
      return;
    }

    const employeeInfo: Employee = {
      lastName: this.lastName.value,
      firstName: this.firstName.value,
      phoneNumber: this.phoneNumber.value,
      email: this.email.value,
      cnp: this.cnp.value,
      type: this.type.value.code,
      address: this.address.value ? this.address.value : null,
      employmentDate: this.date.value.toLocaleString('ro-Ro'),
      education: this.education.value ? this.education.value : null,
      experience: this.experience.value ? this.experience.value : null,
      parafa: this.parafa.value ? this.parafa.value : null,
      hierarchy: this.hierarchy.value ? this.hierarchy.value.code : null,
      specialty: this.specialty.value ? this.specialty.value.code : null,
    };

    if (this.password) {
      employeeInfo['password'] = this.password.value;
    }
  
    this.employeeForm.disable();

    let service = null; 

    if(this.mode === 'add') {
      service = this.employeeService.postEmployee(employeeInfo);
    } else if (this.mode === 'edit') {
      service = this.employeeService.updateEmployee(employeeInfo, this.selectedItem.id);
    }

    if(this.mode !== 'add') {
      if(this.selectedItem.id === this.authService.user.getValue().id) {
        this.confirmationService.confirm({
          message: 'Sunteți pe punctul de a modifca user-ul conectat. În urma confirmării modificărilor veți fi deconectat! Totodată, asigurați-vă că exisă un cont de admin!!!',
          accept: () => {
            this.serviceFunction(service);
            this.authService.logout();
            this.router.navigate(['/']);
          },
          reject: () => {
            this.dialogHeader = 'Informații';
            this.mode = 'view';
            this.employeeForm.disable();
            this.employeeForm.get('doctorsOnly').disable();
            return;
          }
        });
      } else {
        this.serviceFunction(service);
      }
    } else {
      this.serviceFunction(service);
    }
  }

  private serviceFunction(service) {
    service.subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: this.mode === 'add' ? 'Angajatul a fost adăugat cu success.' : 'Angajatul a fost modificat cu success.',
          life: 5000,
        });
        if(this.mode === 'add') {
          this.employees.unshift(v);
          this.filteredEmployees = [...this.employees];
        } else if (this.mode === 'edit') {
          this.employees[this.employees.indexOf(this.selectedItem)] = v;
          this.filteredEmployees = [...this.employees];
        }
        this.isDialogVisible = false;
        this.dialogHeader = 'Informații';
        this.mode = 'view';
        this.employeeForm.reset();
        this.employeeForm.enable();
        this.employeeForm.get('doctorsOnly').disable();
      },
      error: (e) => {
        this.employeeForm.enable();
        if (e.error.error === 'email_taken') {
          this.employeeForm.get('doctorsOnly').disable();
          this.email.setErrors({ ...(this.email.errors || {}), taken: true });
          this.email.markAsTouched();
        }else if (e.error.error === 'cnp_taken') {
          this.employeeForm.get('doctorsOnly').disable();
          this.cnp.setErrors({ ...(this.cnp.errors || {}), taken: true });
          this.cnp.markAsTouched();
        } else if (e.error.error === 'parafa_taken') {
          this.parafa.setErrors({ ...(this.parafa.errors || {}), taken: true });
          this.parafa.markAsTouched();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: e.error.error,
            life: 5000,
          });
        }
      },
    });
  }
}
