export type DomainEvent = {
  source: string;
  eventName: string;
  event: Record<string, any>;
  eventDateTime: string;
  eventVersion: string;
};

export interface ICreateDomainEvent {
  source: string;
  eventName: string;
  event: Record<string, any>;
  eventSchema?: Record<string, any>;
  eventVersion: string;
}
