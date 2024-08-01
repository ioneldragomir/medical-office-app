import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  generateCodeForm: FormGroup;
  resetPasswordForm: FormGroup;
  isGenerate = true;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.generateCodeForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(52),
      ]),
    });

    this.resetPasswordForm = new FormGroup({
      code: new FormControl(null, [
        Validators.required
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
        this.passwordMatch()
      ]),
    });
  }

  get email() {
    return this.generateCodeForm.get('email');
  }

  get code() {
    return this.resetPasswordForm.get('code');
  }
  get password() {
    return this.resetPasswordForm.get('password');
  }
  get passwordConfirm() {
    return this.resetPasswordForm.get('passwordConfirm');
  }

  onSubmitCode() {
    if (!this.generateCodeForm.valid) {
      this.email.markAsTouched();

      return;
    }

    this.generateCodeForm.disable();

    this.authService.generatePasswordResetCode(this.email.value).subscribe({
      next: (v: any) => {
        this.generateCodeForm.enable();

        this.isGenerate = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: v.success,
          life: 5000,
        });
      },
      error: (e) => {
        this.generateCodeForm.enable();
        if (e.error.error === 'email_not_found') {
          this.email.setErrors({
            ...(this.email.errors || {}),
            email_not_found: true,
          });

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

  onSubmitReset() {
    if (!this.resetPasswordForm.valid) {
      this.password.markAsTouched();
      this.passwordConfirm.markAsTouched();
      this.code.markAsTouched();
      return;
    }

    const resetInfo = {
      email: this.email.value,
      code: this.code.value,
      password: this.password.value
    }

    this.resetPasswordForm.disable();
    this.authService.resetPassword(resetInfo).subscribe({
      next: (v: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: v.success,
          life: 5000,
        });

        this.resetPasswordForm.reset();
        this.resetPasswordForm.enable();
        this.router.navigate(['/autentificare']);
      },
      error: (e) => {
        this.resetPasswordForm.enable();
        if (e.error.error === 'code_mismatch') {
          this.code.setErrors({ ...(this.code.errors || {}), code_mismatch: true });
          this.code.markAsTouched();
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
