import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Partner } from './partner.model';
import { AwsService } from '../services/aws.service';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  errorMessage: string;
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  partnerContact: string;
  address: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  url: string;
  constructor(public matDialogRef: MatDialogRef<AddPartnerComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public awsService: AwsService) {
    if (data != null && data.partner.Id) {
      const partner = data.partner as Partner;
      this.partnerId = partner.Id;
      this.partnerName = partner.PartnerName;
      this.partnerEmail = partner.PartnerEmail;
      this.partnerContact = partner.PartnerContact;
      this.address = partner.Address;
      this.city = partner.City;
      this.pincode = partner.Pincode;
      this.latitude = partner.Latitude;
      this.longitude = partner.Longitude;
      this.url = partner.DisplayPicture;
    }
  }

  onSelectFile(event) { // called each time file input changes
    const self = this;
    self.url = '';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = function (e: any) {
        const img = new Image();
        img.onload = (l) => {
          if (img.width <= 500 && img.height <= 500) {
            self.url = e.target.result;
            self.errorMessage = '';
          }  else {
            self.errorMessage = 'Maximum width and height should be less than 500px';
          }
        };
        img.src = e.target.result;
      };
    }
  }
  ngOnInit() {
  }

  async addPartner() {
    // call the api to add the partner. Show error msg if needed. Close once done.
    const partner = new Partner();
    partner.Address = this.address;
    partner.City = this.city;
    partner.DisplayPicture = this.url;
    partner.Latitude = this.latitude;
    partner.Longitude = this.longitude;
    partner.PartnerContact = this.partnerContact;
    partner.PartnerName = this.partnerName;
    partner.PartnerEmail = this.partnerEmail;
    partner.Pincode = this.pincode;
    partner.Id = this.partnerId;
    partner.State = 1;
    await this.awsService.savePartner(partner).subscribe(id =>  {
      if (id) {
        this.errorMessage = '';
        this.matDialogRef.close(true);
      } else {
        this.errorMessage = 'Could not save the partner.';
      }
    }, err => { console.log(err); this.errorMessage = 'Could not save the partner.'; });
  }
}
