const { dynamoDb } = require('../lib/dynamoClient');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing menu item id' })
      };
    }

    await dynamoDb.send(new DeleteCommand({
      TableName: process.env.MENU_ITEMS_TABLE,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)'
    }));

    return {
      statusCode: 204,
      body: ''
    };
  } catch (error) {
    console.error(error);

    if (error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Menu item not found' })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};