const { handler } = require('../../handlers/deleteMenuItem');
const { dynamoDb } = require('../../lib/dynamoClient');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');

jest.mock('../../lib/dynamoClient');

describe('deleteMenuItem Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a menu item successfully and return 204', async () => {
    dynamoDb.send.mockResolvedValue({});

    const event = {
      pathParameters: { id: '123' }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');
    expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
  });

  it('should return 400 when id is missing', async () => {
    const event = { pathParameters: {} };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('Missing menu item id');
  });

  it('should return 404 when menu item does not exist', async () => {
    const error = new Error('Item not found');
    error.name = 'ConditionalCheckFailedException';
    dynamoDb.send.mockRejectedValue(error);

    const event = {
      pathParameters: { id: '999' }
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toBe('Menu item not found');
  });
});