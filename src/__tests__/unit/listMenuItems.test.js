const { handler } = require('../../handlers/listMenuItems');
const { dynamoDb } = require('../../lib/dynamoClient');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

jest.mock('../../lib/dynamoClient');

describe('listMenuItems Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of menu items', async () => {
    const mockItems = [
      { id: '1', name: 'Espresso', price: 4.5 },
      { id: '2', name: 'Croissant', price: 3.0 }
    ];

    dynamoDb.send.mockResolvedValue({ Items: mockItems });

    const response = await handler();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockItems);
    expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(ScanCommand));
  });
});