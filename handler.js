'use strict';
const aws = require('aws-sdk');
const uuid = require('uuid-v4');

const dynamoDb = new aws.DynamoDB.DocumentClient()

const TableName = 'todoList-items';

module.exports.create = (event, context, callback) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const newItem = {
    id: uuid(),
    info: {
      createdAt: Date.now(),
      description: body.description,
      title: body.title
    }
  };

  dynamoDb.put({
    TableName,
    Item: newItem,
  }, (err) => (
    err ? callback(null, {
      statusCode: 500,
      body: JSON.stringify(err.code),
    }) : callback(null, {
      statusCode: 201,
      body: JSON.stringify(newItem),
    })
  ));
}

module.exports.retrieve = (event, context, callback) => {
  dynamoDb.get({
    TableName,
    Key: {
      id: event.pathParameters.id,
    },
  }, (err, result) => (
    err ? callback(null, {
      statusCode: 500,
      body: JSON.stringify(err.code),
    }) : !result.Item ?
        callback(null, {
          statusCode: 404,
          body: JSON.stringify('Item not found'),
        }) : callback(null, {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        })
  ));
}