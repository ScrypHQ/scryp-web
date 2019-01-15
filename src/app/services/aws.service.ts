import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Partner } from '../add-partner/partner.model';
import { HttpClient } from '@angular/common/http';
import { Offer } from '../add-offer/offer.model';

@Injectable()
export class AwsService {
  constructor(public http: HttpClient) { }

  loadPartnerList(): Observable<Partner[]> {
    return this.http.get<Partner[]>(environment.PARTNERS_URL);
  }

  loadPartner(email: string): Observable<Partner> {
    return this.http.get<Partner>(environment.PARTNERS_URL + '/id/?PartnerEmail=' + email);
  }

  savePartner(partner: Partner): Observable<string> {
      return this.http.put<string>(environment.PARTNERS_URL, partner, { responseType: 'text' as 'json' });
  }

  loadOfferList(email: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(environment.OFFERS_URL + '?PartnerEmail=' + email);
  }

  loadOffer(id: string): Observable<Partner> {
    return this.http.get<Partner>(environment.OFFERS_URL + '/id/?Id=' + id);
  }

  saveOffer(offer: Offer): Observable<string> {
      return this.http.put<string>(environment.OFFERS_URL, offer, { responseType: 'text' as 'json' });
  }
}
