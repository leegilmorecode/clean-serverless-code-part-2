import {
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAddress } from '@domain/customer-address/customer-address';
import { CustomerAddressProps } from '@models/customer-address-types';
import { CustomerPlaylistProps } from '@models/customer-playlist-types';

export type CreateCustomerAccountDto = {
  id?: string;
  created?: string;
  updated?: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  customerAddress: CustomerAddress;
};

export type CustomerAccountDto = {
  id: string;
  created: string;
  updated: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  playlists: CustomerPlaylistProps[];
  customerAddress: CustomerAddressProps;
};

export type NewCustomerAccountDto = {
  firstName: string;
  surname: string;
  customerAddress: CustomerAddressProps;
};
