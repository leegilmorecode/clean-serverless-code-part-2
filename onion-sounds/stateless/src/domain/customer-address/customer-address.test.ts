import { CustomerAddress } from './customer-address';
import { CustomerAddressProps } from '@models/customer-address-types';

describe('customer-address', () => {
  it('should create a new customer address', () => {
    // arrange
    const props: CustomerAddressProps = {
      addressLineOne: 'line one',
      addressLineTwo: 'line two',
      addressLineThree: 'line three',
      addressLineFour: 'line four',
      addressLineFive: 'line five',
      postCode: 'ne11bb',
    };

    // act
    const customerAddress: CustomerAddress = CustomerAddress.create(props);

    // assert
    expect(customerAddress).toMatchInlineSnapshot(`
CustomerAddress {
  "props": Object {
    "addressLineFive": "line five",
    "addressLineFour": "line four",
    "addressLineOne": "line one",
    "addressLineThree": "line three",
    "addressLineTwo": "line two",
    "postCode": "ne11bb",
  },
}
`);
  });

  it('should throw an error if address line one is not supplied', () => {
    // arrange
    const props: CustomerAddressProps = {
      addressLineOne: null, // invalid
      addressLineTwo: 'line two',
      addressLineThree: 'line three',
      addressLineFour: 'line four',
      addressLineFive: 'line five',
      postCode: 'ne11bb',
    } as any;

    // act & assert
    expect(() =>
      CustomerAddress.create(props)
    ).toThrowErrorMatchingInlineSnapshot(
      `"address line one and post code are required at a minimum"`
    );
  });

  it('should throw an error if postcode is not supplied', () => {
    // arrange
    const props: CustomerAddressProps = {
      addressLineOne: 'line one',
      addressLineTwo: 'line two',
      addressLineThree: 'line three',
      addressLineFour: 'line four',
      addressLineFive: 'line five',
      postCode: null, // invalid
    } as any;

    // act & assert
    expect(() =>
      CustomerAddress.create(props)
    ).toThrowErrorMatchingInlineSnapshot(
      `"address line one and post code are required at a minimum"`
    );
  });

  it('should throw an error if customer in the US', () => {
    // arrange
    const props: CustomerAddressProps = {
      addressLineOne: 'line one',
      addressLineTwo: 'line two',
      addressLineThree: 'line three',
      addressLineFour: 'line four',
      addressLineFive: 'US', // invalid
      postCode: 'TX1155',
    } as any;

    // act & assert
    expect(() =>
CustomerAddress.create(props)).
toThrowErrorMatchingInlineSnapshot(`"Unable to create accounts in the US"`);
  });

  it('should return the correct dto', () => {
    // arrange
    const props: CustomerAddressProps = {
      addressLineOne: 'line one',
      addressLineTwo: 'line two',
      addressLineThree: 'line three',
      addressLineFour: 'line four',
      addressLineFive: 'line five',
      postCode: 'ne11bb',
    };

    const customerAddress: CustomerAddress = CustomerAddress.create(props);

    // act & assert
    expect(customerAddress.toDto()).toMatchInlineSnapshot(`
Object {
  "addressLineFive": "line five",
  "addressLineFour": "line four",
  "addressLineOne": "line one",
  "addressLineThree": "line three",
  "addressLineTwo": "line two",
  "postCode": "ne11bb",
}
`);
  });
});
