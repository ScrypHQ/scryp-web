import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loggedIn = false;
  constructor(private routerActive: Router, private auth: AuthGuard) {}

  ngOnInit() {
    this.checkUserLoggedIn();
    this.auth.userAuthenticated.subscribe(state => {
      this.loggedIn = state;
      if (!this.loggedIn) {
        this.routerActive.navigate(['/logout']);
      }
    });
  }

  checkUserLoggedIn(): void {
    if (localStorage.getItem('id_token')) {
      this.loggedIn = true;
    }
  }

  navigate(path: string) {
    this.routerActive.navigate([`/${path}`]);
  }
}
