import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private config: PrimeNGConfig, private auth: AuthService) {}

  ngOnInit(): void {
    this.config.setTranslation({
      dayNamesMin:	["Du","Lu","Ma","Mi","Jo","Vi","Sa"],
      monthNames:	["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","December"],
      monthNamesShort:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","December"],
      dateFormat:	'dd.mm.yy',
      firstDayOfWeek: 1,
      emptyMessage: 'Nici un rezultat găsit',
      emptyFilterMessage: 'Nici un rezultat găsit',
      weak: 'Slabă',
      medium: 'Medie',
      strong: 'Puternică',
      passwordPrompt: 'Introduceți parola',
      today: 'Astăzi',
      clear: 'Golește',
      choose: 'Alege',
      upload: 'Încarcă',
      cancel: 'Anulează'
  });

    this.auth.autoLogin();
  }
}
