import { schemaValidator } from '@packages/schema-validator';
interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  protected validate(schema: Record<string, any>): void {
    schemaValidator(schema, this.props);
  }
}
