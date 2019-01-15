import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { QRCodeModule } from 'angular2-qrcode';
import { AuthGuard } from './services/auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderInterceptor } from './services/header-interceptor';
import { AuthService } from './services/auth.service';
import { AwsService } from './services/aws.service';

const appRoutes: Routes = [
  { path: 'logout', component: LoginComponent },
  { path: 'home',  component: HomeComponent , canActivate : [AuthGuard]},
  { path: '**' , redirectTo: '/home'}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddPartnerComponent,
    AddOfferComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    QRCodeModule,
    HttpClientModule
  ],
  entryComponents: [
    AddPartnerComponent,
    AddOfferComponent
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    AuthGuard, AuthService, AwsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
