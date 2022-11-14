import * as updateAccount from '@adapters/secondary/database-adapter/database-adapter';

import {
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { updateCustomerAccount } from '@repositories/update-customer-account-repository/update-customer-account-repository';

describe('update-customer-account-repository', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return the correct customer domain object', async () => {
    // arrange
    const customerAccountProps: CustomerAccountDto = {
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

    const customer: CustomerAccount =
      CustomerAccount.createAccount(customerAccountProps);

    jest
      .spyOn(updateAccount, 'updateAccount')
      .mockResolvedValue(customerAccountProps);

    await expect(updateCustomerAccount(customer)).resolves.
toMatchInlineSnapshot(`
CustomerAccount {
  "_created": "created",
  "_domainEvents": Array [],
  "_id": "111",
  "_updated": "updated",
  "props": Object {
    "created": "created",
    "customerAddress": CustomerAddress {
      "props": Object {
        "addressLineFive": "line five",
        "addressLineFour": "line four",
        "addressLineOne": "line one",
        "addressLineThree": "line three",
        "addressLineTwo": "line two",
        "postCode": "ne11bb",
      },
    },
    "firstName": "Gilmore",
    "id": "111",
    "paymentStatus": "Valid",
    "playlists": Array [],
    "subscriptionType": "Basic",
    "surname": "Lee",
    "updated": "updated",
  },
}
`);
  });
});
