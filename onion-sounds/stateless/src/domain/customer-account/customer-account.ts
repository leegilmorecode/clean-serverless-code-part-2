import * as customerAccountCreatedEvent from '@events/customer-account-created';
import * as customerAccountUpdatedEvent from '@events/customer-account-updated';
import * as customerAccountUpgradedEvent from '@events/customer-account-upgraded';

import {
  CreateCustomerAccountProps,
  NewCustomerAccountProps,
  PaymentStatus,
  SubscriptionType,
} from '@models/customer-account-types';
import {
  CustomerPlaylistProps,
  NewCustomerPlaylistProps,
} from '@models/customer-playlist-types';

import { AggregateRoot } from '@entity/aggregate-root';
import { CustomerAccountDto } from '@dto/customer-account';
import { CustomerAddress } from '@domain/customer-address/customer-address';
import { CustomerPlaylist } from '@domain/customer-playlist';
import { DomainEvent } from '@entity/domain-event';
import { MaxNumberOfPlaylistsError } from '@errors/max-number-of-playlists-error';
import { PaymentInvalidError } from '@errors/payment-invalid-error';
import { PlaylistNotFoundError } from '@errors/playlist-not-found-error';
import { SubscriptionAlreadyUpgradedError } from '@errors/subscription-already-upgraded-error';
import { schema } from '@schemas/customer-account.schema';

// only works with entities and value objects - calling the repositories
// adapter --> use case --> (domain) <-- repository <-- adapter

/**
 * Customer Account Domain Entity
 *
 * A customer account is an entity which allows customers to create a new account, and upgrade their
 * account subscription.
 */
export class CustomerAccount extends AggregateRoot<CreateCustomerAccountProps> {
  private constructor({
    id,
    created,
    updated,
    ...props
  }: CreateCustomerAccountProps) {
    super(props, id, created, updated);
  }

  // retrieve all domain events in the aggregate inc children
  // adapter --> use case --> (domain)
  public retrieveDomainEvents(): DomainEvent[] {
    const childEvents: DomainEvent[] = this.props.playlists
      .map((playList: CustomerPlaylist) => playList.domainEvents)
      .reduce(
        (domainEvent: DomainEvent[], item: DomainEvent[]) =>
          domainEvent.concat(item),
        []
      );

    const existingEvents = [...this.domainEvents.concat(childEvents, [])];

    // clear down the existing events on the queue
    this.clearDomainEvents();
    this.props.playlists.forEach((playlist) => playlist.clearDomainEvents());

    return existingEvents;
  }

  // retrieve an instance of the playlist on a given account
  // adapter --> use case --> (domain)
  public retrievePlaylist(playlistId: string): CustomerPlaylist {
    const playlist: CustomerPlaylist | undefined = this.props.playlists.find(
      (playlist: CustomerPlaylist) => playlist.id === playlistId
    );

    if (playlist === undefined) {
      throw new PlaylistNotFoundError(`Playlist ${playlistId} not found`);
    }
    return playlist;
  }

  // create an instance of a new customer account through a factory method
  // adapter --> use case --> (domain)
  public static createAccount(props: NewCustomerAccountProps): CustomerAccount {
    const customerAccountProps: CreateCustomerAccountProps = {
      firstName: props.firstName,
      surname: props.surname,
      subscriptionType: SubscriptionType.Basic,
      paymentStatus: PaymentStatus.Valid,
      playlists: [],
      customerAddress: CustomerAddress.create(props.customerAddress),
    };

    const instance: CustomerAccount = new CustomerAccount(customerAccountProps);
    instance.validate(schema);

    instance.addDomainEvent({
      event: instance.toDto(),
      eventName: customerAccountCreatedEvent.eventName,
      source: customerAccountCreatedEvent.eventSource,
      eventSchema: customerAccountCreatedEvent.eventSchema,
      eventVersion: customerAccountCreatedEvent.eventVersion,
    });

    return instance;
  }

  // upgrade a customer account from basic to advanced through a service (use case)
  // adapter --> use case --> (domain)
  public upgradeAccount(): void {
    // only allow an upgrade if the payment status is valid
    if (this.props.paymentStatus === PaymentStatus.Invalid) {
      throw new PaymentInvalidError('Payment is invalid - unable to upgrade');
    }

    // we can not upgrade an account which is already upgraded
    if (this.props.subscriptionType === SubscriptionType.Upgraded) {
      throw new SubscriptionAlreadyUpgradedError(
        'Subscription is already upgraded - unable to upgrade'
      );
    }

    // update the account to upgraded
    this.props.subscriptionType = SubscriptionType.Upgraded;

    this.setUpdatedDate();
    this.validate(schema);

    this.addDomainEvent({
      event: this.toDto(),
      eventName: customerAccountUpgradedEvent.eventName,
      source: customerAccountUpgradedEvent.eventSource,
      eventSchema: customerAccountUpgradedEvent.eventSchema,
      eventVersion: customerAccountUpgradedEvent.eventVersion,
    });
  }

  // create a customer playlist on the customer account through a service (use case)
  // adapter --> use case --> (domain)
  public createPlaylist(playlistName: string): CustomerPlaylist {
    const playlistProps: NewCustomerPlaylistProps = { playlistName };
    const newPlaylist: CustomerPlaylist =
      CustomerPlaylist.createPlaylist(playlistProps);

    if (this.props.playlists.length === 2) {
      throw new MaxNumberOfPlaylistsError(
        'maximum number of playlists reached'
      );
    }

    // create the new playlist
    this.props.playlists.push(newPlaylist);

    this.setUpdatedDate();
    this.validate(schema);

    this.addDomainEvent({
      event: this.toDto(),
      eventName: customerAccountUpdatedEvent.eventName,
      source: customerAccountUpdatedEvent.eventSource,
      eventSchema: customerAccountUpdatedEvent.eventSchema,
      eventVersion: customerAccountUpdatedEvent.eventVersion,
    });

    return newPlaylist;
  }

  // create a dto based on the domain instance
  public toDto(): CustomerAccountDto {
    return {
      id: this.id,
      created: this.created,
      updated: this.updated,
      firstName: this.props.firstName,
      surname: this.props.surname,
      subscriptionType: this.props.subscriptionType,
      paymentStatus: this.props.paymentStatus,
      playlists: this.props.playlists.map((item: CustomerPlaylist) =>
        item.toDto()
      ),
      customerAddress: this.props.customerAddress.toDto(),
    };
  }

  // create a domain object based on the dto
  public static toDomain(raw: CustomerAccountDto): CustomerAccount {
    const playlists: CustomerPlaylist[] = raw.playlists.map(
      (item: CustomerPlaylistProps) => CustomerPlaylist.toDomain(item)
    );

    const customerAddress = CustomerAddress.create(raw.customerAddress);

    const instance = new CustomerAccount({
      ...raw,
      playlists,
      customerAddress,
    });
    return instance;
  }
}
