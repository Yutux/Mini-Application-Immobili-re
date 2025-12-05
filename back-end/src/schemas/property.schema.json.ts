export const propertySchemaJSON = {
  type: 'object',
  required: ['title','description','city','price','surface','rooms','type','status'],
  properties: {
    title: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 10 },
    city: { type: 'string', minLength: 2 },
    price: { type: 'number', minimum: 0 },
    surface: { type: 'number', minimum: 0 },
    rooms: { type: 'integer', minimum: 0 },
    type: { type: 'string', enum: ['apartment','house','studio','loft'] },
    status: { type: 'string', enum: ['for_sale','for_rent','sold','rented'] }
  }
};

export const updatePropertySchemaJSON = {
  type: 'object',
  properties: propertySchemaJSON.properties
};

export const propertyIdSchemaJSON = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' }
  }
};
