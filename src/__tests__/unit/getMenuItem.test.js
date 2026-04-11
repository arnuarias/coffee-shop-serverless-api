const { handler } = require('../../handlers/getMenuItem');
const { dynamoDb } = require('../../lib/dynamoClient');

jest.mock('../../lib/dynamoClient');

describe('getMenuItem Handler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return item when found', async () => {
    const mockItem = { id: '123', name: 'Espresso', price: 4.5 };
    dynamoDb.send.mockResolvedValue({ Item: mockItem });

    const event = { pathParameters: { id: '123' } };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockItem);
  });

  it('should return 404 when item not found', async () => {
    dynamoDb.send.mockResolvedValue({ Item: undefined });
    const event = { pathParameters: { id: '999' } };

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
  });
});