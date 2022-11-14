import * as publishDomainEvents from '@repositories/publish-event-recipient/publish-event-recipient';
import * as retrieveCustomerAccount from '@repositories/retrieve-customer-account-repository/retrieve-customer-account-repository';
import * as updateCustomerAccount from '@repositories/update-customer-account-repository/update-customer-account-repository';

import {
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { upgradeCustomerAccountUseCase } from '@use-cases/upgrade-customer-account/upgrade-customer-account';

let customerAccountDto: CustomerAccountDto;

describe('upgrade-customer-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
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

  it('should update the subscription type on success', async () => {
    // arrange
    const customerId = '111';
    const response = await upgradeCustomerAccountUseCase(customerId);

    // act / assert
    expect(response).toMatchInlineSnapshot(`
Object {
  "created": "2022-01-01T00:00:00.000Z",
  "customerAddress": Object {
    "addressLineFive": "line five",
    "addressLineFour": "line four",
    "addressLineOne": "line one",
    "addressLineThree": "line three",
    "addressLineTwo": "line two",
    "postCode": "ne11bb",
  },
  "firstName": "Gilmore",
  "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "paymentStatus": "Valid",
  "playlists": Array [],
  "subscriptionType": "Upgraded",
  "surname": "Lee",
  "updated": "2022-01-01T00:00:00.000Z",
}
`);
  });
});
