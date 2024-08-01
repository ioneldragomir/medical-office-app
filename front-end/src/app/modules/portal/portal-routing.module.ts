import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ChartsComponent } from './components/charts/charts.component';
import { ContactMessagesComponent } from './components/contact-messages/contact-messages.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PacientsComponent } from './components/pacients/pacients.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PortalComponent } from './portal.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: 'profil', component: ProfileComponent },
      { path: 'programari', component: AppointmentsComponent },
      { path: 'pacienti', component: PacientsComponent },
      { path: 'angajati', component: EmployeesComponent },
      { path: 'statistici', component: ChartsComponent },
      { path: 'mesaje-contact', component: ContactMessagesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
