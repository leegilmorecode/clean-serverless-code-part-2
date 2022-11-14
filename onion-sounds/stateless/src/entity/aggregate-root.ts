import { DomainEvent } from './domain-event';
import { Entity } from './entity';

// denotes visually that this entity is the aggregate root
// and stores the overall domain events for publishing
export abstract class AggregateRoot<T> extends Entity<T> {
  // aggregates which implement this must create this method
  // to consolidate events from the full aggrgate root and children
  abstract retrieveDomainEvents(): DomainEvent[];
}
