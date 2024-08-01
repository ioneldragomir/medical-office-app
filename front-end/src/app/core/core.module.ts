import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { RegisterComponent } from './authentication/register/register.component';

import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {CheckboxModule} from 'primeng/checkbox';
import {DividerModule} from 'primeng/divider';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    DividerModule
  ],
  exports: [NavbarComponent, FooterComponent],
  declarations: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    AuthenticationComponent,
    ResetPasswordComponent,
    RegisterComponent,
  ],
})
export class CoreModule {}
