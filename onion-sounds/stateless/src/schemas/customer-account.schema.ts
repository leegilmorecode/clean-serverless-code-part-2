export const schema = {
  type: 'object',
  required: [
    'id',
    'firstName',
    'surname',
    'paymentStatus',
    'subscriptionType',
    'playlists',
    'created',
    'updated',
    'customerAddress',
  ],
  maxProperties: 9,
  minProperties: 9,
  properties: {
    id: {
      type: 'string',
    },
    firstName: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    surname: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    paymentStatus: {
      type: 'string',
      enum: ['Valid', 'Invalid'],
    },
    subscriptionType: {
      type: 'string',
      enum: ['Basic', 'Upgraded'],
    },
    created: {
      type: 'string',
    },
    updated: {
      type: 'string',
    },
    playlists: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    customerAddress: {
      type: 'object',
    },
  },
};
