import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public innerWidth: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  onNavigate(index: number) {
    switch (index) {
      case 0:
        this.router.navigate(['/locatie']);
        break;
      case 1:
        this.router.navigate(['/programari']);
        break;
      case 2:
        this.router.navigate(['/medici']);
        break;
    }
  }
}
