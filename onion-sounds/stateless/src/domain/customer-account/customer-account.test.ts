import {
  NewCustomerAccountProps,
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { CustomerPlaylist } from '@domain/customer-playlist';

let customer: CustomerAccountDto = {
  created: '2022-01-01T00:00:00.000Z',
  firstName: 'Lee',
  id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
  paymentStatus: PaymentStatus.Valid,
  subscriptionType: SubscriptionType.Basic,
  surname: 'Gilmore',
  updated: '2022-01-01T00:00:00.000Z',
  playlists: [],
  customerAddress: {
    addressLineOne: 'line one',
    addressLineTwo: 'line two',
    addressLineThree: 'line three',
    addressLineFour: 'line four',
    addressLineFive: 'line five',
    postCode: 'ne11bb',
  },
};

describe('customer-account', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('create account', () => {
    it('should fail creating a new account with an invalid customer', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: '±', // invalid
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act / assert
      expect(() =>
CustomerAccount.createAccount(newCustomerAccount)).
toThrowErrorMatchingInlineSnapshot(`"[{\\"instancePath\\":\\"/firstName\\",\\"schemaPath\\":\\"#/properties/firstName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`);
    });

    it('should create the new account successfully with a valid customer', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);

      // assert
      expect(newCustomer).toMatchSnapshot();
    });
  });

  describe('upgrade account', () => {
    it('should upgrade an existing customer by id if payment status is valid', () => {
      // arrange
      const customerAccount: CustomerAccount = CustomerAccount.toDomain({
        ...customer,
        subscriptionType: SubscriptionType.Basic,
      });

      // act
      customerAccount.upgradeAccount();

      // assert
      expect(customerAccount).toMatchSnapshot();
    });

    it('should not upgrade an existing customer by id if payment status is invalid', () => {
      // arrange
      const customerAccount: CustomerAccount = CustomerAccount.toDomain({
        ...customer,
        paymentStatus: PaymentStatus.Invalid,
      });

      // act / assert
      expect(() => customerAccount.upgradeAccount()).toThrow(
        'Payment is invalid - unable to upgrade'
      );
    });

    it('should not upgrade an existing customer by id if status is already upgraded', () => {
      // arrange
      const customerAccount: CustomerAccount = CustomerAccount.toDomain({
        ...customer,
        paymentStatus: PaymentStatus.Valid,
        subscriptionType: SubscriptionType.Upgraded,
      });

      // act / assert
      expect(() => customerAccount.upgradeAccount()).toThrow(
        'Subscription is already upgraded - unable to upgrade'
      );
    });
  });

  describe('create playlist', () => {
    it('should add the playlist successfully', () => {
      // arrange
      const customerAccount: CustomerAccount = CustomerAccount.toDomain({
        ...customer,
        subscriptionType: SubscriptionType.Basic,
      });
      const playlistName = 'newplaylist';

      // act
      customerAccount.createPlaylist(playlistName);

      // assert
      expect(customerAccount).toMatchSnapshot();
    });

    it('should throw an error if there are more than 2 playlists', () => {
      // arrange
      const customerAccount: CustomerAccount = CustomerAccount.toDomain({
        ...customer,
        subscriptionType: SubscriptionType.Basic,
      });

      customerAccount.createPlaylist('playlistOne');
      customerAccount.createPlaylist('playlistTwo');

      // act & assert
      expect(() =>
        customerAccount.createPlaylist('playlistThree')
      ).toThrowErrorMatchingInlineSnapshot(
        `"maximum number of playlists reached"`
      );
    });
  });

  describe('toDto', () => {
    it('should create the correct dto', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);

      // assert
      expect(newCustomer.toDto()).toMatchSnapshot();
    });
  });

  describe('toDomain', () => {
    it('should create a domain object based on a dto', () => {
      // arrange
      const customerAccountProps: CustomerAccountDto = {
        id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
        firstName: 'Lee',
        surname: 'Gilmore',
        paymentStatus: PaymentStatus.Valid,
        subscriptionType: SubscriptionType.Upgraded,
        created: '2022-01-01T00:00:00.000Z',
        updated: '2022-01-01T00:00:00.000Z',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
        playlists: [
          {
            id: 'a49e49ad-8f88-448f-8a15-41d560ad6d70',
            playlistName: 'testplaylist',
            songIds: [],
            created: '2022-01-01T00:00:00.000Z',
            updated: '2022-01-01T00:00:00.000Z',
          },
        ],
      };

      // act
      const customerAccount: CustomerAccount =
        CustomerAccount.toDomain(customerAccountProps);

      // assert
      expect(customerAccount).toMatchSnapshot();
    });
  });

  describe('retrieve playlist', () => {
    it('should return the playlist successfully if found', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);
      const createdPlaylist: CustomerPlaylist =
        newCustomer.createPlaylist('playlistTwo');

      // assert
      expect(newCustomer.retrievePlaylist(createdPlaylist.id)).
toMatchInlineSnapshot(`
CustomerPlaylist {
  "_created": "2022-01-01T00:00:00.000Z",
  "_domainEvents": Array [
    Object {
      "event": Object {
        "created": "2022-01-01T00:00:00.000Z",
        "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
        "playlistName": "playlistTwo",
        "songIds": Array [],
        "updated": "2022-01-01T00:00:00.000Z",
      },
      "eventDateTime": "2022-01-01T00:00:00.000Z",
      "eventName": "CustomerPlaylistCreated",
      "eventVersion": "1",
      "source": "com.customer-account-onion",
    },
  ],
  "_id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "_updated": "2022-01-01T00:00:00.000Z",
  "props": Object {
    "created": "2022-01-01T00:00:00.000Z",
    "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
    "playlistName": "playlistTwo",
    "songIds": Array [],
    "updated": "2022-01-01T00:00:00.000Z",
  },
}
`);
    });

    it('should throw an error if playlist not found', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);
      newCustomer.createPlaylist('playlistone');

      // assert
      expect(() =>
        newCustomer.retrievePlaylist('playlisttwo')
      ).toThrowErrorMatchingInlineSnapshot(`"Playlist playlisttwo not found"`);
    });
  });

  describe('add domain event', () => {
    it('should return the domain events on the object', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);
      newCustomer.createPlaylist('playlistone');

      // assert
      expect(newCustomer.retrieveDomainEvents()).toMatchSnapshot();
    });

    it('should clear all domain events once retrieved', () => {
      // arrange
      const newCustomerAccount: NewCustomerAccountProps = {
        firstName: 'Lee',
        surname: 'Gilmore',
        customerAddress: {
          addressLineOne: 'line one',
          addressLineTwo: 'line two',
          addressLineThree: 'line three',
          addressLineFour: 'line four',
          addressLineFive: 'line five',
          postCode: 'ne11bb',
        },
      };

      // act
      const newCustomer = CustomerAccount.createAccount(newCustomerAccount);
      newCustomer.createPlaylist('playlistone');
      newCustomer.retrieveDomainEvents(); // call this once to flush the events

      // assert
      expect(newCustomer.retrieveDomainEvents()).toEqual([]);
    });
  });
});
