const { handler } = require('../../handlers/createMenuItem');
const { dynamoDb } = require('../../lib/dynamoClient');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

jest.mock('../../lib/dynamoClient', () => ({
  dynamoDb: {
    send: jest.fn()
  }
}));

describe('createMenuItem Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a menu item successfully and return 201', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Espresso',
        category: 'beverage',
        price: 4.5,
        description: 'Strong coffee'
      })
    };

    dynamoDb.send.mockResolvedValue({});

    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toMatchObject({
      name: 'Espresso',
      category: 'beverage',
      price: 4.5
    });
    expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  it('should return 400 when required fields are missing', async () => {
    const event = { body: JSON.stringify({ name: 'Latte' }) };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toContain('Missing required fields');
  });
});