import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { PageNotFoundComponent } from 'src/app/core/components/page-not-found/page-not-found.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ContactComponent } from './components/contact/contact.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from 'src/app/core/authentication/authentication.component';
import { ResetPasswordComponent } from 'src/app/core/authentication/reset-password/reset-password.component';
import { RegisterComponent } from 'src/app/core/authentication/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'medici', component: DoctorsComponent },
      { path: 'programari', component: AppointmentsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'autentificare', component: AuthenticationComponent },
      { path: 'resetare-parola', component: ResetPasswordComponent },
      { path: 'cont-nou', component: RegisterComponent },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
