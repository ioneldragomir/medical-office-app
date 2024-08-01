import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PortalComponent implements OnInit, OnDestroy {
  items: MenuItem[];
  user = null;
  display = false;
  sidebarVisible: boolean = false;

  subscription: Subscription;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  get fullName() {
    return `${this?.user?.lastName} ${this?.user?.firstName}`;
  }

  ngOnInit(): void {
    this.router.navigate(['programari'], {relativeTo: this.route});

    this.subscription = this.auth.user.subscribe(u => {
      this.user = u;
    });

    this.items = [
      {
        icon: 'fa-solid fa-calendar-check',
        label: 'Programări',
        routerLink: '/portal/programari',
        routerLinkActiveOptions: {
          style: 'background-color: red'
        },
        style: { "font-family": "'Lora', serif"}
      },
      {
        icon: 'fa-solid fa-hospital-user',
        label: 'Pacienți',
        routerLink: '/portal/pacienti',
        visible: this.user?.type !== 'pacient',
        style: { "font-family": "'Lora', serif"}
      },
      {
        icon: this.user?.type === 'admin' ? 'fa-solid fa-user': 'fa-solid fa-user-doctor',
        label: this.user?.type === 'admin' ? 'Angajați' : 'Medici',
        routerLink: '/portal/angajati',
        visible: this.user?.type === 'admin' || this.user?.type === 'receptionist',
        style: { "font-family": "'Lora', serif"}
      },
      {
        icon: 'fa-solid fa-envelope-open',
        label: 'Mesaje',
        routerLink: '/portal/mesaje-contact',
        visible: this.user?.type === 'admin',
        style: { "font-family": "'Lora', serif"}
      },
      {
        icon: 'fa-solid fa-chart-simple',
        label: 'Statistici',
        routerLink: '/portal/statistici',
        visible: this.user?.type === 'admin',
        style: { "font-family": "'Lora', serif"}
      },
    ];
  }

  navigate() {
    this.router.navigate(['profil'], {relativeTo: this.route});
  }

  logout() {
    this.router.navigate(['/']);
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
