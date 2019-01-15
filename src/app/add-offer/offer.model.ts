export class Offer {
  Id: string;
  OfferName: string;
  OfferedBy: string;
  OfferedByEmail: string;
  IsConditional: boolean;
  Condition: string;
  ValidFrom: Date;
  ValidTill: Date;
  Description: string;
  ItemOnOffer: string;
  ItemPrice: number;
  ScrypPrice: number;
  OfferQRCode: string;
  IsInactive: boolean;
}
