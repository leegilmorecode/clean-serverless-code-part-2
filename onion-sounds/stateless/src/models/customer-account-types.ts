import { CustomerAddress } from '@domain/customer-address/customer-address';
import { CustomerAddressProps } from '@models/customer-address-types';
import { CustomerPlaylist } from '@domain/customer-playlist';

export enum SubscriptionType {
  Basic = 'Basic',
  Upgraded = 'Upgraded',
}

export enum PaymentStatus {
  Valid = 'Valid',
  Invalid = 'Invalid',
}

export type CreateCustomerAccountProps = {
  id?: string;
  created?: string;
  updated?: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  playlists: CustomerPlaylist[];
  customerAddress: CustomerAddress;
};

export type CustomerAccountProps = {
  id: string;
  created: string;
  updated: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  playlists: CustomerPlaylist[];
  customerAddress: CustomerAddress;
};

export type NewCustomerAccountProps = {
  firstName: string;
  surname: string;
  customerAddress: CustomerAddressProps;
};
