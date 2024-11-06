// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let connection = null;

// MongoDB database connection
const initMongoConnection = async () => {
  const connURL = process.env.NOSQL_DB_CONNECTION_STRING;
  const client = await mongoose.connect(connURL);
  connection = client;
};

const getConnection = () => connection;

module.exports = {
  initMongoConnection,
  getConnection,
};
