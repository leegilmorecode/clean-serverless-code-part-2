import * as createCustomerAccount from '@repositories/create-customer-account-repository/create-customer-account-repository';
import * as publishDomainEvents from '@repositories/publish-event-recipient/publish-event-recipient';

import {
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { createCustomerAccountUseCase } from '@use-cases/create-customer-account/create-customer-account';

let customerAccountDto: CustomerAccountDto;

describe('create-customer-use-case', () => {
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
      .spyOn(createCustomerAccount, 'createCustomerAccount')
      .mockResolvedValue(createdAccount);

    jest.spyOn(publishDomainEvents, 'publishDomainEvents').mockResolvedValue();
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await createCustomerAccountUseCase(customerAccountDto);
    // arrange / assert
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
  "subscriptionType": "Basic",
  "surname": "Lee",
  "updated": "2022-01-01T00:00:00.000Z",
}
`);
  });
});
