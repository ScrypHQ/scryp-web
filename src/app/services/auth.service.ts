import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { AuthGuard } from '../services/auth.guard';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AuthService {
  constructor(public http: HttpClient, private auth: AuthGuard) { }

  logOut() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('selected-partner');
    this.auth.userAuthenticated.emit(false);
  }
}
