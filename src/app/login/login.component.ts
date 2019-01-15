import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.authService.logOut();

    window.location.href = 'https://' + environment.OAUTH_IDP_DOMAIN + '/logout' +
      '?response_type=token&client_id=' + environment.OAUTH_IDP_APP_CLIENT_ID +
      '&redirect_uri=' + environment.APP_LOGIN;

    return;
  }
}
