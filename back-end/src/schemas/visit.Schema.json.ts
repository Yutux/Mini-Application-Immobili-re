export const visitSchemaJSON = {
  type: 'object',
  required: ['propertyId', 'date', 'visitorName'],
  properties: {
    propertyId: { type: 'string', minLength: 1 },
    date: { type: 'string', format: 'date-time' },
    visitorName: { type: 'string', minLength: 1 },
    notes: { type: 'string' }
  }
};

export const updateVisitSchemaJSON = {
  type: 'object',
  properties: visitSchemaJSON.properties
};

export const visitIdSchemaJSON = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' }
  }
};
