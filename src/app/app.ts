import { Component, signal, ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav  } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LeftNav } from './layout/left-nav/left-nav';
import { MainContent } from './layout/main-content/main-content';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    LeftNav,
    MainContent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;

  toggleLeft() {
    this.leftSidenav.toggle();
  }
}
