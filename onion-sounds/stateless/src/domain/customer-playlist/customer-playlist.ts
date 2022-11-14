import * as customerPlaylistCreatedEvent from '@events/customer-playlist-created';
import * as songAddedToPlaylistEvent from '@events/song-added-to-playlist';

import {
  CreateCustomerPlaylistProps,
  NewCustomerPlaylistProps,
} from '@models/customer-playlist-types';

import { CustomerPlaylistDto } from '@dto/customer-playlist';
import { Entity } from '@entity/entity';
import { MaxPlaylistSizeError } from '@errors/max-playlist-size-error';
import { schema } from '@schemas/customer-playlist.schema';

/**
 * Customer Playlist Domain Entity
 *
 * A customer playlist is an entity which allows customers to manage one or more playlists.
 */
export class CustomerPlaylist extends Entity<CreateCustomerPlaylistProps> {
  private constructor({
    id,
    created,
    updated,
    ...props
  }: CreateCustomerPlaylistProps) {
    super(props, id, created, updated);
  }

  // create an instance of a new customer playlist through a factory method
  public static createPlaylist(
    props: NewCustomerPlaylistProps
  ): CustomerPlaylist {
    const customerAccountProps: CreateCustomerPlaylistProps = {
      playlistName: props.playlistName,
      songIds: [],
    };

    const instance: CustomerPlaylist = new CustomerPlaylist(
      customerAccountProps
    );

    instance.validate(schema);

    instance.addDomainEvent({
      event: instance.toDto(),
      eventName: customerPlaylistCreatedEvent.eventName,
      source: customerPlaylistCreatedEvent.eventSource,
      eventSchema: customerPlaylistCreatedEvent.eventSchema,
      eventVersion: customerPlaylistCreatedEvent.eventVersion,
    });

    return instance;
  }

  // add a song to the playlist
  public addSongToPlaylist(songId: string): void {
    if (this.props.songIds.length >= 4) {
      throw new MaxPlaylistSizeError('the maximum playlist length is 4');
    }

    this.props.songIds.push(songId);

    this.setUpdatedDate();
    this.validate(schema);

    this.addDomainEvent({
      event: this.toDto(),
      eventName: songAddedToPlaylistEvent.eventName,
      source: songAddedToPlaylistEvent.eventSource,
      eventSchema: songAddedToPlaylistEvent.eventSchema,
      eventVersion: songAddedToPlaylistEvent.eventVersion,
    });
  }

  // create a dto based on the domain instance
  public toDto(): CustomerPlaylistDto {
    return {
      id: this.id,
      created: this.created,
      updated: this.updated,
      playlistName: this.props.playlistName,
      songIds: this.props.songIds,
    };
  }

  // create a domain object based on the dto
  public static toDomain(raw: CustomerPlaylistDto): CustomerPlaylist {
    const instance = new CustomerPlaylist(raw);
    return instance;
  }
}
