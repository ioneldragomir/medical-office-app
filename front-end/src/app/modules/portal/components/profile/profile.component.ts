import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/core/models/employee.model';
import { Pacient } from 'src/app/core/models/pacient.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { PacientService } from 'src/app/core/services/pacient.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: Pacient | Employee = null;

  isEdit = false;

  msgs = null;

  constructor(
    private auth: AuthService, 
    private messageService: MessageService,  
    private pacientService: PacientService,
    private employeeService: EmployeeService
    ) { }

  ngOnInit(): void {
    this.user = this.auth.user.getValue();
    this.initForm();
  }

  toggleMode() {
    this.isEdit = !this.isEdit;
  }

  private initForm() {
    this.profileForm = new FormGroup({
      common: new FormGroup({
        lastName: new FormControl(this.user.lastName, [
          Validators.required,
          Validators.maxLength(24),
        ]),
        firstName: new FormControl(this.user.firstName, [
          Validators.required,
          Validators.maxLength(24),
        ]),
        phoneNumber: new FormControl(this.user.phoneNumber, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ]),
        email: new FormControl(this.user.email, [
          Validators.required,
          Validators.email,
          Validators.maxLength(52),
        ]),
      }),
      passwordReset: new FormGroup({
        password: new FormControl(null, [
          Validators.minLength(6),
          Validators.maxLength(32),
        ]),
        passwordConfirm: new FormControl(null, [
          Validators.minLength(6),
          Validators.maxLength(32),
          this.passwordMatch(),
        ]),
      }),
    });

    this.profileForm.get('common').disable();
  }

  get lastName() {
    return this.profileForm.get('common.lastName');
  }
  get firstName() {
    return this.profileForm.get('common.firstName');
  }
  get phoneNumber() {
    return this.profileForm.get('common.phoneNumber');
  }
  get email() {
    return this.profileForm.get('common.email');
  }
  get password() {
    return this.profileForm.get('passwordReset.password');
  }
  get passwordConfirm() {
    return this.profileForm.get('passwordReset.passwordConfirm');
  }

  passwordMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (control.value != this.password.value) {
        return { invalid: true };
      }

      return null;
    };
  }

  onSaveEdit(flag?: boolean) {
    if (!this.profileForm.valid) {
      this.lastName.markAsTouched();
      this.firstName.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.email.markAsTouched();
      return;
    }

    const userInfo = {
      lastName: this.lastName.value,
      firstName: this.firstName.value,
      phoneNumber: this.phoneNumber.value,
      email: this.email.value,
      type: 'pacient'
    };

    if(flag) {
      userInfo['password'] = this.password.value;
    }

    this.profileForm.disable();

    let service = null;

    if(this.user.type == 'pacient') {
      service = this.pacientService.updatePacient(userInfo, this.user.id);
    } else {
      userInfo.type = this.user.type;
      service = this.employeeService.updateEmployee(userInfo, this.user.id);
    }

    service.subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Contul dumneavoastră a fost actualizat cu succes.',
          life: 5000,
        });

        this.msgs = [];
        this.auth.updateUser(v);
        this.user = v;
        this.profileForm.enable();
        this.profileForm.get('common').disable();
        if(flag) {
          this.profileForm.get('passwordReset').reset();
        } else {
          this.onCancelEdit();
        }

      },
      error: (e) => {
        this.profileForm.enable();
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

  onResetPassword() {
    this.msgs = [];
    if(this.isEdit) {
      this.msgs.push({severity:'warn', summary:'Atenție', detail:'Pentru a modifica parola trebuie să renunțați/confirmați modificările de mai sus.'});
      return 
    }

    if (!this.profileForm.valid) {
      this.password.markAsTouched();
      this.passwordConfirm.markAsTouched();
      return;
    }

    if(!this.password.value || !this.passwordConfirm.value) {
      this.msgs.push({severity:'error', summary:'Eroare', detail:'Introduceți parola nouă.'});
      return;
    }

    this.onSaveEdit(true);
  }

  onCancelEdit() {
    this.msgs = [];
    this.toggleMode();
    this.profileForm.get('common').disable();
    const user = this.auth.user.getValue();
    this.profileForm.patchValue({
      common: {
        lastName: user.lastName,
        firstName: user.firstName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      }
    });
  }

  onStartEdit() {
    this.toggleMode();
    this.profileForm.get('common').enable();
  }
 
}
