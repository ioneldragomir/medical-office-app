import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/core/models/appointment.model';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { PacientService } from 'src/app/core/services/pacient.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  appointmentsData = null;
  appointmentsOptions = null;
  appointmentStatistic = {};

  accountsData = null;
  accountStatistics = {};

  messagesData = null;
  messagesOptions = null;
  messagesStatistics = {};

  activeState: boolean[] = [true, false, false];

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  constructor(
    private appointmentService: AppointmentService,
    private employeeService: EmployeeService,
    private pacientService: PacientService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.appointmentsOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    for (let i = 1; i < 13; i++) {
      this.appointmentStatistic[i] = 0;
    }

    this.appointmentService.getAppointments({}).subscribe({
      next: (e) => {
        e.forEach((e: Appointment) => {
          let month = e.date.split('.')[1];

          if (month[0] === '0') month = month[1];

          this.appointmentStatistic[month] += 1;
        });

        this.appointmentsData = {
          labels: [
            'Ianuarie',
            'Februarie',
            'Martie',
            'Aprilie',
            'Mai',
            'Iunie',
            'Iulie',
            'August',
            'Septembrie',
            'Octombrie',
            'Noiembrie',
            'December',
          ],
          datasets: [
            {
              label: 'Numărul de programări realizate',
              backgroundColor: '#42A5F5',
              data: Object.values(this.appointmentStatistic),
            },
          ],
        };
      },
    });

    this.accountStatistics = {
      admin: 0,
      doctor: 0,
      pacient: 0,
      receptionist: 0,
    };

    this.pacientService.getPacients().subscribe({
      next: (p) => {
        this.accountStatistics['pacient'] = p.length ? p.length : 0;

        this.employeeService.getEmployees().subscribe({
          next: (e) => {
            e.forEach((element) => {
              this.accountStatistics[element.type] += 1;
            });

            this.accountsData = {
              labels: ['Administratori', 'Medici', 'Pacienți', 'Recepționeri'],
              datasets: [
                {
                  data: Object.values(this.accountStatistics),
                  backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#f75959'],
                  hoverBackgroundColor: [
                    '#64B5F6',
                    '#81C784',
                    '#FFB74D',
                    '#fc7474',
                  ],
                },
              ],
            };
          },
        });
      },
    });

    this.messagesOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    for (let i = 1; i < 13; i++) {
      this.messagesStatistics[i] = 0;
    }

    this.contactService.getContactMessage().subscribe({
      next: (c) => {
        c.forEach(e => {
          let month = e.date.split('.')[1];

          if (month[0] === '0') month = month[1];

          this.messagesStatistics[month] += 1;
        });
        
        this.messagesData = {
          labels: [
            'Ianuarie',
            'Februarie',
            'Martie',
            'Aprilie',
            'Mai',
            'Iunie',
            'Iulie',
            'August',
            'Septembrie',
            'Octombrie',
            'Noiembrie',
            'December',
          ],
          datasets: [
            {
              label: 'Numărul de mesaje primite',
              backgroundColor: '#66BB6A',
              data: Object.values(this.messagesStatistics),
            },
          ],
        };
        
      },
    });
  }
}
