const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

const marshallOptions = {
  removeUndefinedValues: true,
};

module.exports.dynamoDb = DynamoDBDocumentClient.from(client, { marshallOptions });