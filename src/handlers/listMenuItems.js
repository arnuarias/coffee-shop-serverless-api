const { dynamoDb } = require('../lib/dynamoClient');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async () => {
  try {
    const result = await dynamoDb.send(new ScanCommand({
      TableName: process.env.MENU_ITEMS_TABLE,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};