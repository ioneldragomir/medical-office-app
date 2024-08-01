import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pacient } from '../../models/pacient.model';
import { PacientService } from '../../services/pacient.service';

@Component({
  selector: 'app-auth',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private pacientService: PacientService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = new FormGroup({
      personalData: new FormGroup({
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
      }),
      accountData: new FormGroup({
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(52),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ]),
        passwordConfirm: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
          this.passwordMatch(),
        ]),
      }),
      imIn: new FormControl(false, Validators.requiredTrue)
    });
  }

  get lastName() {
    return this.registerForm.get('personalData.lastName');
  }
  get firstName() {
    return this.registerForm.get('personalData.firstName');
  }
  get phoneNumber() {
    return this.registerForm.get('personalData.phoneNumber');
  }
  get email() {
    return this.registerForm.get('accountData.email');
  }
  get password() {
    return this.registerForm.get('accountData.password');
  }
  get passwordConfirm() {
    return this.registerForm.get('accountData.passwordConfirm');
  }
  get imIn() {
    return this.registerForm.get('imIn');
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

  onSubmit() {
    if (!this.registerForm.valid) {
      this.lastName.markAsTouched();
      this.firstName.markAsTouched();
      this.phoneNumber.markAsTouched();
      this.email.markAsTouched();
      this.password.markAsTouched();
      this.passwordConfirm.markAsTouched();
      this.imIn.markAsTouched();
      return;
    }

    const pacientInfo: Pacient = {
      lastName: this.lastName.value,
      firstName: this.firstName.value,
      phoneNumber: this.phoneNumber.value,
      email: this.email.value,
      password: this.password.value,
    };

    this.registerForm.disable();
    this.pacientService.postPacient(pacientInfo).subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: v.success,
          life: 5000,
        });

        this.registerForm.reset();
        this.registerForm.enable();
        this.router.navigate(['/autentificare']);
      },
      error: (e) => {
        this.registerForm.enable();
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
}
