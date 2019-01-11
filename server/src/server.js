const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('../config');

// Database initialization
let db_url = config.DB_URL;
let port = config.PORT;
if(process.env.NODE_ENV === 'test') {
    db_url = config.TEST_DB_URL;
    port = config.TEST_PORT;
}
mongoose.connect(db_url);

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

const payments = require('./routes/payments');
app.use('/payments', payments);

const management = require('./routes/management');
app.use('/management', management);

// Web server initialization
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}.`);
});

module.exports = app;

