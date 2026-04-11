const { dynamoDb } = require('../lib/dynamoClient');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing id parameter' })
      };
    }

    const result = await dynamoDb.send(new GetCommand({
      TableName: process.env.MENU_ITEMS_TABLE,
      Key: { id },
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Menu item not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};