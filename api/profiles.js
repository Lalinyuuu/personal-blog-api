const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/profiles', (_req, res) => {
  res.status(200).json({
    data: { name: 'john', age: 20 }
  });
});

module.exports = serverless(app);