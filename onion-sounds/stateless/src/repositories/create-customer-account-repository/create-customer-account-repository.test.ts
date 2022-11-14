import * as createAccount from '@adapters/secondary/database-adapter/database-adapter';

import { CustomerAccount } from '@domain/customer-account';
import { NewCustomerAccountProps } from '@models/customer-account-types';
import { createCustomerAccount } from '@repositories/create-customer-account-repository';

describe('create-customer-account-repository', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
  });
  afterAll(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should return the correct customer domain object', async () => {
    // arrange
    const customerAccountProps: NewCustomerAccountProps = {
      firstName: 'Gilmore',
      surname: 'Lee',
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

    jest.spyOn(createAccount, 'createAccount').mockResolvedValue({
      ...customer.toDto(),
    });

    await expect(createCustomerAccount(customer)).resolves.
toMatchInlineSnapshot(`
CustomerAccount {
  "_created": "2023-01-01T00:00:00.000Z",
  "_domainEvents": Array [],
  "_id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "_updated": "2023-01-01T00:00:00.000Z",
  "props": Object {
    "created": "2023-01-01T00:00:00.000Z",
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
    "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
    "paymentStatus": "Valid",
    "playlists": Array [],
    "subscriptionType": "Basic",
    "surname": "Lee",
    "updated": "2023-01-01T00:00:00.000Z",
  },
}
`);
  });
});
