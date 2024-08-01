import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Pacient } from 'src/app/core/models/pacient.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { PacientService } from 'src/app/core/services/pacient.service';

@Component({
  selector: 'app-portal-pacients',
  templateUrl: './pacients.component.html',
  styleUrls: ['./pacients.component.scss'],
})
export class PacientsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  isLoading = false;
  numberOfCols = 6;
  pacients: Pacient[] = [];
  selectedItem = null;

  isDialogVisible = false;
  dialogHeader = 'Informații';

  pacientForm: FormGroup;
  mode = 'view';

  user= null;

  constructor(
    private pacientService: PacientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    this.pacientService.getPacients().subscribe({
      next: (e) => {
        this.pacients = e;
        this.isLoading = false;
      },
    });

    this.initForm();
  }

  private initForm() {
    this.pacientForm = new FormGroup({
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
        Validators.email,
        Validators.maxLength(52),
      ]),
    });
  }

  get lastName() {
    return this.pacientForm.get('lastName');
  }
  get firstName() {
    return this.pacientForm.get('firstName');
  }
  get phoneNumber() {
    return this.pacientForm.get('phoneNumber');
  }
  get email() {
    return this.pacientForm.get('email');
  }

  filterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  toggleAddEmployee() {
    this.isDialogVisible = true;
    this.dialogHeader = 'Adăugare';
    this.mode = 'add';

    this.pacientForm.reset();
    this.pacientForm.enable();
  }

  viewItem(item: Pacient) {
    this.dialogHeader = 'Informații';
    this.selectedItem = item;
    this.mode = 'view';
    this.pacientForm.disable();
    this.isDialogVisible = true;

    this.pacientForm.patchValue({
      lastName: item.lastName,
      firstName: item.firstName,
      email: item.email,
      phoneNumber: item.phoneNumber,
    });
  }

  onCancelEdit() {
    this.mode = 'view';
    this.pacientForm.disable();
    this.dialogHeader = 'Informații';
  }

  onToggleEdit() {
    this.dialogHeader = 'Modificare';
    this.mode = 'edit';
    this.pacientForm.enable();
    this.email.disable();
  }

  deleteItem(item: Pacient) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți acest pacient?',
      accept: () => {
        this.pacientService.deletePacient(item.id).subscribe({
          next: (v: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: v.success,
              life: 3000,
            });
            this.pacients = this.pacients.filter((m) => m.id !== item.id);
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
    if (!this.pacientForm.valid) {
      this.lastName.markAsTouched();
      this.firstName.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.email.markAsTouched();
      return;
    }

    const pacentInfo: Pacient = {
      lastName: this.lastName.value,
      firstName: this.firstName.value,
      phoneNumber: this.phoneNumber.value,
      email: this.email.value ? this.email.value : null,
      type: 'pacient',
    };

    console.log(pacentInfo);
    

    this.pacientForm.disable();

    let service = null;

    if (this.mode === 'add') {
      service = this.pacientService.postPacientPortal(pacentInfo);
    } else if (this.mode === 'edit') {
      service = this.pacientService.updatePacient(
        pacentInfo,
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
              ? 'Pacientul a fost adăugat cu success.'
              : 'Pacientul a fost modificat cu success.',
          life: 5000,
        });
        if (this.mode === 'add') {
          this.pacients.unshift(v);
        } else if (this.mode === 'edit') {
          this.pacients[this.pacients.indexOf(this.selectedItem)] = v;
        }
        this.isDialogVisible = false;
        this.dialogHeader = 'Informații';
        this.mode = 'view';
        this.pacientForm.reset();
        this.pacientForm.enable();
      },
      error: (e) => {
        this.pacientForm.enable();
        if (e.error.error === 'email_taken') {
          this.email.setErrors({ ...(this.email.errors || {}), taken: true });
          this.email.markAsTouched();
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

  selectAppointments(pacient: Pacient) {
    this.router.navigate(['/portal/programari'], {state: {data: pacient.id}});
  }
}
