import {
  CustomerPlaylistDto,
  NewCustomerPlaylistSongDto,
} from '@dto/customer-playlist';

import { CustomerAccount } from '@domain/customer-account';
import { CustomerPlaylist } from '@domain/customer-playlist';
import { publishDomainEvents } from '@repositories/publish-event-recipient';
import { retrieveCustomerAccount } from '@repositories/retrieve-customer-account-repository';
import { updateCustomerAccount } from '@repositories/update-customer-account-repository';

// takes a dto and calls the domain entities (returning a dto to the primary adapter)
// adapter --> (use case) --> domain & repositories

/**
 * Adds a song to a Customer Playlist
 * Input: accountId, playlistId
 * Output: CustomerPlaylistDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account
 *  2. Add the song to the playlist
 *  3. Save the changes as a whole (aggregate root)
 *  4. Publish a SongAddedToPlaylist event.
 */
export async function addSongToPlaylistUseCase(
  accountId: string,
  playlistId: string,
  song: NewCustomerPlaylistSongDto
): Promise<CustomerPlaylistDto> {
  const existingAccount: CustomerAccount = await retrieveCustomerAccount(
    accountId
  );

  // get the playlist in question from the existing account
  const playlist: CustomerPlaylist =
    existingAccount.retrievePlaylist(playlistId);

  // add the song to the playlist
  playlist.addSongToPlaylist(song.songId);

  // persist the full aggregate root i.e. all entities (we can't update one on its own)
  await updateCustomerAccount(existingAccount);

  await publishDomainEvents(existingAccount.retrieveDomainEvents());

  return playlist.toDto();
}
