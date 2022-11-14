import * as publishEvent from '@adapters/secondary/event-adapter/event-adapter';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerAddressProps } from '@models/customer-address-types';
import { NewCustomerAccountProps } from '@models/customer-account-types';
import { publishDomainEvents } from '@repositories/publish-event-recipient/publish-event-recipient';

describe('publish-event-repository', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return void on success', async () => {
    // arrange
    const customerAddress: CustomerAddressProps = {
      addressLineOne: 'line one',
      postCode: 'ne11bb',
    };
    const newCustomer: NewCustomerAccountProps = {
      firstName: 'Lee',
      surname: 'Gilmore',
      customerAddress,
    };

    const customer: CustomerAccount =
      CustomerAccount.createAccount(newCustomer);

    jest.spyOn(publishEvent, 'publishEvent').mockReturnThis();

    await expect(
      publishDomainEvents(customer.retrieveDomainEvents())
    ).resolves.toBeUndefined();
  });
});
