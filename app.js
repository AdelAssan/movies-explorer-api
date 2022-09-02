const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverError = require('./middlewares/serverError');
const index = require('./routes/index');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);

app.use(index);

app.use(errorLogger);
app.use(errors());

app.use(serverError);

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.listen(PORT);
