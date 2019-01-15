import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
    @Output() userAuthenticated: EventEmitter<boolean> = new EventEmitter();
    loggedIn = false;

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('id_token')) {
            return true;
        } else {

            const params = new URLSearchParams(window.location.href.split('#')[1]);
            const access_token = params.get('access_token');
            const id_token = params.get('id_token');

            if (id_token) {
                localStorage.setItem('id_token', id_token);
                this.userAuthenticated.emit(true);
            }

            if (!id_token) {
                window.location.href = 'https://' + environment.OAUTH_IDP_DOMAIN + '/login' +
                    '?response_type=token&client_id=' + environment.OAUTH_IDP_APP_CLIENT_ID +
                    '&redirect_uri=' + environment.APP_LOGIN;
                return false;
            } else {
                this.router.navigate(['/home']);
            }
        }

        return false;
    }
}
