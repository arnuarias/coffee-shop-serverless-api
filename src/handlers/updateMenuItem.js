const { dynamoDb } = require('../lib/dynamoClient');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing menu item id' })
      };
    }

    const body = JSON.parse(event.body || '{}');

    if (!body.name || !body.category || typeof body.price !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: name, category, price' })
      };
    }

    const now = new Date().toISOString();

    const result = await dynamoDb.send(new UpdateCommand({
      TableName: process.env.MENU_ITEMS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #name = :name, #category = :category, #price = :price, #description = :description, #updatedAt = :updatedAt',
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#category': 'category',
        '#price': 'price',
        '#description': 'description',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':name': body.name,
        ':category': body.category,
        ':price': body.price,
        ':description': body.description || '',
        ':updatedAt': now
      },
      ReturnValues: 'ALL_NEW'
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
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