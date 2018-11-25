const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('../config');

// Database initialization
mongoose.connect(config.DB_URL);

mongoose.connection.on('connected', () => {
    console.log('✅ Successfully connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Could not connect to database.');
    throw err;
});

// API configuration
const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('../config/passport')(passport);

const auth = require('./routes/auth');
app.use('/auth', auth);

const recarga = require('./routes/recarga');
app.use('/recarga', recarga);

const management = require('./routes/management');
app.use('/management', management);

// Web server initialization
app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}.`);
});



