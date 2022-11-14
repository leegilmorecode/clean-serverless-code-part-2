import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { logger } from '@packages/logger';
import { publishDomainEvents } from '@repositories/publish-event-recipient';
import { retrieveCustomerAccount } from '@repositories/retrieve-customer-account-repository';
import { updateCustomerAccount } from '@repositories/update-customer-account-repository';

// takes a dto and calls the domain entities (returning a dto to the primary adapter)
// adapter --> (use case) --> repositories

/**
 * Upgrade an existing Customer Account
 * Input: Customer account ID
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account based on ID
 *  2. Upgrade and validate the customer account
 *  3. Publish a CustomerAccountUpdated event.
 */
export async function upgradeCustomerAccountUseCase(
  id: string
): Promise<CustomerAccountDto> {
  const customerAccount: CustomerAccount = await retrieveCustomerAccount(id);

  customerAccount.upgradeAccount();

  await updateCustomerAccount(customerAccount);

  logger.info(`customer account ${id} upgraded`);

  await publishDomainEvents(customerAccount.retrieveDomainEvents());

  return customerAccount.toDto();
}
