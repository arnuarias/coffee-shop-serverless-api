const { v4: uuidv4 } = require('uuid');
const { dynamoDb } = require('../lib/dynamoClient');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.name || !body.category || typeof body.price !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: name, category, price' })
      };
    }

    const now = new Date().toISOString();

    const newItem = {
      id: uuidv4(),
      name: body.name,
      category: body.category,
      price: body.price,
      description: body.description || '',
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(new PutCommand({
      TableName: process.env.MENU_ITEMS_TABLE,
      Item: newItem,
    }));

    return {
      statusCode: 201,
      body: JSON.stringify(newItem)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};