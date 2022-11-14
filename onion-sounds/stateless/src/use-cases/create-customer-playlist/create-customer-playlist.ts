import {
  CustomerPlaylistDto,
  NewCustomerPlaylistDto,
} from '@dto/customer-playlist';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerPlaylist } from '@domain/customer-playlist';
import { logger } from '@packages/logger';
import { publishDomainEvents } from '@repositories/publish-event-recipient';
import { retrieveCustomerAccount } from '@repositories/retrieve-customer-account-repository';
import { updateCustomerAccount } from '@repositories/update-customer-account-repository';

// takes a dto and calls the domain entities (returning a dto to the primary adapter)
// adapter --> (use case) --> domain & repositories

/**
 * Create a new Customer Playlist
 * Input: accountId, playlist
 * Output: CustomerPlaylistDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account
 *  2. Create and add the new customer playlist to the account
 *  3. Save the changes as a whole (aggregate root)
 *  4. Publish a CustomerPlaylistCreated event.
 */
export async function createCustomerPlaylistUseCase(
  accountId: string,
  playlist: NewCustomerPlaylistDto
): Promise<CustomerPlaylistDto> {
  const existingAccount: CustomerAccount = await retrieveCustomerAccount(
    accountId
  );

  const newPlaylist: CustomerPlaylist = existingAccount.createPlaylist(
    playlist.playlistName
  );

  // persist the full aggregate root i.e. both entities (we can't update one on its own)
  await updateCustomerAccount(existingAccount);

  logger.info(
    `customer playlist ${newPlaylist.id} created for ${existingAccount.id}`
  );

  await publishDomainEvents(existingAccount.retrieveDomainEvents());

  return newPlaylist.toDto();
}
