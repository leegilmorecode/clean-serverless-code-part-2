import { DomainEvent } from '@entity/domain-event';
import { publishEvent } from '@adapters/secondary/event-adapter';

// this is the repository which the domain calls to utilise the adapter
// only working with domain entities, and translating dto's from the secondary adapters
// domain --> (repository) --> adapter
export async function publishDomainEvents(
  events: DomainEvent[]
): Promise<void> {
  const eventsToPublish: Promise<void>[] = events.map((item) =>
    publishEvent(
      item.event,
      item.eventName,
      item.source,
      item.eventVersion,
      item.eventDateTime
    )
  );
  await Promise.all(eventsToPublish);
}
