import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatDialog } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { AddPartnerComponent } from '../add-partner/add-partner.component';
import { AddOfferComponent } from '../add-offer/add-offer.component';
import { Offer } from '../add-offer/offer.model';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Partner } from '../add-partner/partner.model';
import { AwsService } from '../services/aws.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog,
    public authService: AuthService, public http: HttpClient,
    public awsService: AwsService, private changeDetectorRefs: ChangeDetectorRef) { }
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'itemName', 'itemPrice', 'scrypPrice', 'view', 'delete'];
  currentUser: string;
  isAdmin = false;
  partnerName: string;
  partners: Partner[] = [];
  selectedPartner: Partner;
  prevPartner: Partner;

  async ngOnInit() {
    await this.getCurrentUserData();
  }

  logout() {
    this.authService.logOut();
  }

  addPartner() {
    const dialogRef = this.dialog.open(AddPartnerComponent, { width : '75%' });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.loadPartnerList(1);
      } else {
        this.selectedPartner = this.prevPartner;
      }
    });
  }

  addOffer() {
    // create offer dialog box
    const dialogRef = this.dialog.open(AddOfferComponent, { width : '75%', data: {partner: this.selectedPartner} });

    dialogRef.afterClosed().subscribe(result => {
      this.getOffers(this.selectedPartner.PartnerEmail);
    });
  }

  selectPartner(partner) {
    this.prevPartner = partner;
    localStorage.setItem('selected-partner', partner.PartnerEmail);
    this.selectedPartner = partner;
    this.getOffers(this.selectedPartner.PartnerEmail);
  }

  viewOffer(offerData: Offer) {
    const dialogRef = this.dialog.open(AddOfferComponent, { width : '75%', data : { partner: this.selectedPartner, offer :  offerData} });

    dialogRef.afterClosed().subscribe(result => {
      this.getOffers(this.selectedPartner.PartnerEmail);
    });
  }

  async getCurrentUserData() {
    const id_token = localStorage.getItem('id_token');
    const jwtService = new JwtHelperService();
    const tokenData = jwtService.decodeToken(id_token);
    localStorage.setItem('current-user', tokenData['email']);
    this.currentUser = tokenData['name'] ? tokenData['name'] : tokenData['email'];
    this.isAdmin = tokenData['cognito:groups'] ? true : false;
    if (this.isAdmin) {
      await this.loadPartnerList(0);
    } else {
      await this.loadPartner(tokenData['email']);
    }
  }

  async loadPartnerList(sel: number) {
   await this.awsService.loadPartnerList().subscribe(k => {
     this.partners = k;
     if (k.length === 0) {
       alert('Create a partner.');
       return;
     }
     if (localStorage.getItem('selected-partner')) {
       this.selectedPartner = k.find(u => u.PartnerEmail === localStorage.getItem('selected-partner'));
     }
     if (!this.selectedPartner) {
       this.selectedPartner = k[0];
       if (sel === 1) {
         sel = this.partners.length - 1;
       }
       if (sel !== -1) {
         this.selectedPartner = k[sel];
       }
       localStorage.setItem('selected-partner', this.selectedPartner.PartnerEmail);
     }
     this.getOffers(this.selectedPartner.PartnerEmail);
   });
  }

  async loadPartner(email) {
    await this.awsService.loadPartner(email).subscribe(k => {
      this.selectedPartner = k;
      localStorage.setItem('selected-partner', this.selectedPartner.PartnerEmail);
      this.getOffers(this.selectedPartner.PartnerEmail);
    });
  }

  manage() {
    const dialogRef = this.dialog.open(AddPartnerComponent, { width : '75%', data: { partner: this.selectedPartner } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPartnerList(-1);
      }
    });
  }

  async getOffers(email) {
    await this.awsService.loadOfferList(email).subscribe(k => {
      this.dataSource.data = k;
      this.changeDetectorRefs.detectChanges();
    });
  }

  async deleteOffer(offer: Offer) {
    offer.IsInactive = true;
    await this.awsService.saveOffer(offer).subscribe(k => {
      this.getOffers(this.selectedPartner.PartnerEmail);
    });
  }
}
