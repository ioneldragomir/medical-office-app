import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup({
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
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.email.patchValue(this.email.value);
    if (!this.loginForm.valid) {
      this.email.markAsTouched();
      this.password.markAsTouched();

      return;
    }
    this.loginForm.disable();

    this.authService.login(this.loginForm.value).subscribe({
      next: (v: any) => {
        this.authService.user.next(v);

        this.loginForm.reset();
        this.loginForm.enable();

        this.router.navigate(['/portal']);
      },
      error: (e) => {
        this.loginForm.enable();
        if (e.error.error === 'unauthorized') {
          this.email.setErrors({
            ...(this.email.errors || {}),
            unauthorized: true,
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

  resetPassword() {
    this.router.navigate(['/resetare-parola']);
  }

  register() {
    this.router.navigate(['/cont-nou']);
  }
}
