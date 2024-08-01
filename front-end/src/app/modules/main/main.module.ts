import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {AccordionModule} from 'primeng/accordion';
import {DataViewModule} from 'primeng/dataview';

import { MainComponent } from './main.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';


@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    CoreModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ToastModule,
    CardModule,
    StepsModule,
    DropdownModule,
    CalendarModule,
    AccordionModule,
    DataViewModule
  ],
  exports: [],
  declarations: [
    MainComponent,
    HomeComponent,
    DoctorsComponent,
    AppointmentsComponent,
    ContactComponent,
  ],
  providers: [],
})
export class MainModule {}
