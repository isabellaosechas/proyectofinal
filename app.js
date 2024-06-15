require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/User');
const loginRouter = require('./controllers/login');
const { PAGE_URL } = require('./config');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('conectado a mongodb');
    } catch (error) {
        console.log(error);
    }
})();

module.exports = app;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


//Rutas frontend

app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

app.use(morgan('tiny'));
//Rutas Backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
