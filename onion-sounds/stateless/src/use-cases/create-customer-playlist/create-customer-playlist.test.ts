import * as publishDomainEvents from '@repositories/publish-event-recipient/publish-event-recipient';
import * as retrieveCustomerAccount from '@repositories/retrieve-customer-account-repository/retrieve-customer-account-repository';
import * as updateCustomerAccount from '@repositories/update-customer-account-repository/update-customer-account-repository';

import {
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { NewCustomerPlaylistDto } from '@dto/customer-playlist';
import { createCustomerPlaylistUseCase } from '@use-cases/create-customer-playlist';

let newCustomerPlaylistDto: NewCustomerPlaylistDto;
let customerAccountDto: CustomerAccountDto;

describe('create-customer-playlist-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    newCustomerPlaylistDto = {
      playlistName: 'testplaylist',
    };
    customerAccountDto = {
      id: '111',
      firstName: 'Gilmore',
      surname: 'Lee',
      subscriptionType: SubscriptionType.Basic,
      paymentStatus: PaymentStatus.Valid,
      created: 'created',
      updated: 'updated',
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

    const createdAccount: CustomerAccount =
      CustomerAccount.createAccount(customerAccountDto);

    jest
      .spyOn(retrieveCustomerAccount, 'retrieveCustomerAccount')
      .mockResolvedValue(createdAccount);

    jest
      .spyOn(updateCustomerAccount, 'updateCustomerAccount')
      .mockResolvedValue(createdAccount);

    jest.spyOn(publishDomainEvents, 'publishDomainEvents').mockResolvedValue();
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await createCustomerPlaylistUseCase(
      '111',
      newCustomerPlaylistDto
    );
    // arrange / assert
    expect(response).toMatchInlineSnapshot(`
Object {
  "created": "2022-01-01T00:00:00.000Z",
  "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "playlistName": "testplaylist",
  "songIds": Array [],
  "updated": "2022-01-01T00:00:00.000Z",
}
`);
  });
});
