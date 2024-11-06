const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const ApiError = require('./utils/ApiError');
const { jwtStrategy } = require('./utils/Token');
const errorHandler = require('./middlewares/error.middleware');
const authRoute = require('./routes/auth.route');
const todolistRoute = require('./routes/todolist.route');

const { initMongoConnection } = require('./configs/db');

const app = express();

// Initialize environment config
dotenv.config();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(bodyParser.json());
app.use(cookieParser());

// TODO=update dev url
const whitelist = [process.env.WHITE_LISTED_DOMAIN];
// enable cors
const corsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Application routes
app.use('/auth', authRoute);
app.use('/todolist', todolistRoute);

// send back a 404 error for any unknown api request
app.all('*', (req, res, next) => {
  next(ApiError(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND)));
});

app.use(errorHandler);

const port = process.env.PORT;

// Run the application
try {
  initMongoConnection()
    .then(async () => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch(console.log);
} catch (e) {
  console.log('Error in running the service:', e);
}
