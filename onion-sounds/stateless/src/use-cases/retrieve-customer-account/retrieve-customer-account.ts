import { CustomerAccount } from '@domain/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { logger } from '@packages/logger';
import { retrieveCustomerAccount } from '@repositories/retrieve-customer-account-repository';

// takes a dto and calls the domain entities (returning a dto to the primary adapter)
// adapter --> (use case) --> repositories

/**
 * Retrueve a Customer Account
 * Input: Customer account ID
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1.Retrieve the customer account based on ID
 */
export async function retrieveCustomerAccountUseCase(
  id: string
): Promise<CustomerAccountDto> {
  const instance: CustomerAccount = await retrieveCustomerAccount(id);

  logger.info(`retrieved customer account for ${id}`);

  return instance.toDto();
}
