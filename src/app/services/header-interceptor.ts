import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!req.url.includes('login')) {
            const modifiedRequest = req.clone({
                setHeaders: {
                    'Authorization': localStorage.getItem('id_token')
                }
            });
            return next.handle(modifiedRequest)
                .catch(err => {
                    if (err.status === 401) {
                        this.authService.logOut();

                        window.location.href = 'https://' + environment.OAUTH_IDP_DOMAIN + '/logout' +
                          '?response_type=token&client_id=' + environment.OAUTH_IDP_APP_CLIENT_ID +
                          '&redirect_uri=' + environment.APP_LOGIN;
                        return Observable.throw(err.error);
                    }
                });
        }
    }
}
