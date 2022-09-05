const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimitter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverError = require('./middlewares/serverError');
const index = require('./routes/index');
require('dotenv').config();

const { PORT = 3000, MongoDB = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(index);

app.use(errorLogger);
app.use(errors());

app.use(serverError);

mongoose.connect(MongoDB);

app.listen(PORT);
