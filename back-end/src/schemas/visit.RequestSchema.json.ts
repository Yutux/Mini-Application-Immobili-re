export const visitRequestSchemaJSON = {
  type: 'object',
  required: ['propertyId', 'requesterName', 'requesterEmail'],
  properties: {
    propertyId: { type: 'string', minLength: 1 },
    requesterName: { type: 'string', minLength: 1 },
    requesterEmail: { type: 'string', format: 'email' },
    message: { type: 'string' }
  }
};

export const updateVisitRequestSchemaJSON = {
  type: 'object',
  properties: visitRequestSchemaJSON.properties
};

export const visitRequestIdSchemaJSON = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' }
  }
};
