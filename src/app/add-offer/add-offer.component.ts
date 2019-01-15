import { Component, OnInit, ViewChildren, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MAT_DIALOG_DATA, MatDialogRef } from '../../../node_modules/@angular/material';
import { Offer } from './offer.model';
import { Partner } from '../add-partner/partner.model';
import { AwsService } from '../services/aws.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {
  @ViewChildren('qrcode') qrCodeElem;
  errorMessage: string;
  offerId: string;
  offerName: string;
  description: string;
  itemName: string;
  itemPrice: number;
  scrypPrice: number;
  condition: string;
  startOfferDate: Date;
  endOfferDate: Date;
  isConditional = false;
  qrCode = 'Spend;0';
  partner: Partner;
  constructor(public matDialogRef: MatDialogRef<AddOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public awsService: AwsService) {
    this.partner = data.partner;
    if (data.offer != null && data.offer.Id) {
      const offer = data.offer as Offer;
      this.offerId = offer.Id;
      this.offerName = offer.OfferName;
      this.description = offer.Description;
      this.itemName = offer.ItemOnOffer;
      this.itemPrice = offer.ItemPrice;
      this.scrypPrice = offer.ScrypPrice;
      this.isConditional = offer.IsConditional;
      this.condition = offer.IsConditional ? offer.Condition : null;
      this.startOfferDate = new Date(offer.ValidFrom);
      this.endOfferDate = new Date(offer.ValidTill);
      this.createQRCode();
    }
   }

  ngOnInit() {
  }

  changeEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // check the date field and set the correct value
    if (type === 'startDate') {
      if (this.endOfferDate < event.value) {
        this.endOfferDate = new Date(event.value);
        this.startOfferDate = new Date(this.endOfferDate);
      } else {
        this.startOfferDate = new Date(event.value);
      }
    } else {
      if (this.startOfferDate > event.value) {
        this.startOfferDate = new Date(event.value);
        this.endOfferDate = new Date(this.startOfferDate);
      } else {
        this.endOfferDate = new Date(event.value);
      }
    }
  }

  createQRCode() {
    this.qrCode = 'Spend;' + this.scrypPrice;
  }

  async createOffer() {
    // create json and send to API
    const offer = new Offer();
    offer.Id = this.offerId;
    offer.OfferName = this.offerName;
    offer.ItemOnOffer = this.itemName;
    offer.IsConditional = this.isConditional;
    if (offer.IsConditional) {
      offer.Condition = this.condition;
    }
    offer.OfferedBy = this.partner.PartnerName;
    offer.OfferedByEmail = this.partner.PartnerEmail;
    offer.ValidFrom = this.startOfferDate;
    offer.ValidTill = this.endOfferDate;
    offer.ItemPrice = this.itemPrice;
    offer.ScrypPrice = this.scrypPrice;
    offer.Description = this.description;
    offer.OfferQRCode = this.qrCodeElem.first.elementRef.nativeElement.children[0].currentSrc;

    console.log(offer);

    await this.awsService.saveOffer(offer).subscribe(id =>  {
      if (id) {
        this.errorMessage = '';
        this.matDialogRef.close(true);
      } else {
        this.errorMessage = 'Could not save the offer.';
      }
    }, err => { console.log(err); this.errorMessage = 'Could not save the offer.'; });
  }
}
