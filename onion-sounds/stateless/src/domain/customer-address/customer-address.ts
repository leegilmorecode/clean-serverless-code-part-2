import { CustomerAddressDto } from '@dto/customer-address';
import { CustomerAddressProps } from '@models/customer-address-types';
import { ValueObject } from '@entity/value-object';
import { schema } from '@schemas/customer-address';

export class CustomerAddressInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerAddressInvalidError';
  }
}

export class CustomerAddressNonUSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerAddressNonUSError';
  }
}

export class CustomerAddress extends ValueObject<CustomerAddressProps> {
  private constructor({ ...props }: CustomerAddressProps) {
    super(props);
  }

  // create a new version of the customer address through a factory method
  // after we have validated the value object logic (immutable version)
  public static create(customerAddress: CustomerAddressProps): CustomerAddress {
    if (!customerAddress.addressLineOne || !customerAddress.postCode) {
      throw new CustomerAddressInvalidError(
        'address line one and post code are required at a minimum'
      );
    }
    // this is made up business logic for the demo
    if (customerAddress.addressLineFive === 'US') {
      throw new CustomerAddressNonUSError(
        'Unable to create accounts in the US'
      );
    }

    const newCustomerAddress = new CustomerAddress(customerAddress);

    // validate the value object using the schema
    newCustomerAddress.validate(schema);

    return newCustomerAddress;
  }

  public toDto(): CustomerAddressDto {
    return {
      addressLineOne: this.props.addressLineOne,
      addressLineTwo: this.props.addressLineTwo,
      addressLineThree: this.props.addressLineThree,
      addressLineFour: this.props.addressLineFour,
      addressLineFive: this.props.addressLineFive,
      postCode: this.props.postCode,
    };
  }
}
