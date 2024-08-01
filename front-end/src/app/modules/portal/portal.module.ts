import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PortalComponent } from './portal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PacientsComponent } from './components/pacients/pacients.component';
import { ContactMessagesComponent } from './components/contact-messages/contact-messages.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ChartsComponent } from './components/charts/charts.component';

import { PortalRoutingModule } from './portal-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PickListModule} from 'primeng/picklist';
import {FileUploadModule} from 'primeng/fileupload';
import {ChartModule} from 'primeng/chart';
import {SidebarModule} from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MenubarModule,
    AvatarModule,
    OverlayPanelModule,
    DividerModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    TableModule,
    DropdownModule,
    AccordionModule,
    ConfirmDialogModule,
    DialogModule,
    SelectButtonModule,
    InputTextareaModule,
    CalendarModule,
    ScrollPanelModule,
    PickListModule,
    FileUploadModule,
    ChartModule,
    SidebarModule,
    OverlayPanelModule,
    MenuModule
  ],
  exports: [],
  declarations: [
    PortalComponent,
    ProfileComponent,
    AppointmentsComponent,
    PacientsComponent,
    ContactMessagesComponent,
    EmployeesComponent,
    ChartsComponent

  ],
  providers: [],
})
export class PortalModule {}
