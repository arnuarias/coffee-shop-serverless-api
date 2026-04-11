const { handler } = require('../../handlers/updateMenuItem');
const { dynamoDb } = require('../../lib/dynamoClient');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

jest.mock('../../lib/dynamoClient');

describe('updateMenuItem Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a menu item successfully and return 200', async () => {
    const mockUpdatedItem = {
      id: '123',
      name: 'Double Espresso',
      category: 'beverage',
      price: 5.5,
      description: 'Updated description',
      updatedAt: '2026-04-01T12:00:00.000Z'
    };

    dynamoDb.send.mockResolvedValue({ Attributes: mockUpdatedItem });

    const event = {
      pathParameters: { id: '123' },
      body: JSON.stringify({
        name: 'Double Espresso',
        category: 'beverage',
        price: 5.5,
        description: 'Updated description'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockUpdatedItem);
    expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
  });

  it('should return 400 when required fields are missing', async () => {
    const event = {
      pathParameters: { id: '123' },
      body: JSON.stringify({ name: 'Latte' })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toContain('Missing required fields');
  });

  it('should return 404 when menu item does not exist', async () => {
    const error = new Error('Item not found');
    error.name = 'ConditionalCheckFailedException';
    dynamoDb.send.mockRejectedValue(error);

    const event = {
      pathParameters: { id: '999' },
      body: JSON.stringify({
        name: 'Cappuccino',
        category: 'beverage',
        price: 4.8
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toBe('Menu item not found');
  });
});