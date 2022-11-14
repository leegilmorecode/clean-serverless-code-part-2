import { CustomerAccount } from '@domain/customer-account/customer-account';
import { CustomerAccountDto } from '@dto/customer-account';
import { updateAccount } from '@adapters/secondary/database-adapter';

// this is the repository which the domain calls to utilise the adapter
// only working with domain entities, and translating dto's from the secondary adapters
// domain --> (repository) --> adapter (always returns a domain object)
export async function updateCustomerAccount(
  account: CustomerAccount
): Promise<CustomerAccount> {
  // use the adapter to call the database
  const customerAccount: CustomerAccountDto = await updateAccount(
    account.toDto()
  );
  return CustomerAccount.toDomain(customerAccount);
}
