import {
  CustomerAccountDto,
  NewCustomerAccountDto,
} from '@dto/customer-account';

import { CustomerAccount } from '@domain/customer-account';
import { createCustomerAccount } from '@repositories/create-customer-account-repository';
import { logger } from '@packages/logger';
import { publishDomainEvents } from '@repositories/publish-event-recipient';

// takes a dto and calls the domain entities (returning a dto to the primary adapter)
// adapter --> (use case) --> domain & repositories

/**
 * Create a new Customer Account
 * Input: NewCustomerAccountDto
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1. Validate the customer account details
 *  2. Create a new customer account
 *  3. Publish a CustomerAccountCreated event.
 */
export async function createCustomerAccountUseCase(
  account: NewCustomerAccountDto
): Promise<CustomerAccountDto> {
  const newCustomer: CustomerAccount = CustomerAccount.createAccount(account);

  await createCustomerAccount(newCustomer);
  logger.info(`customer account created for ${newCustomer.id}`);

  await publishDomainEvents(newCustomer.retrieveDomainEvents());

  return newCustomer.toDto();
}
