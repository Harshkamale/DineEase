require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const session=require('express-session')
const MongoDbstore =require('connect-mongo')
const flash = require('express-flash')
// Database connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.on('error', err => {
    console.error('Connection error:', err);
});

connection.once('open', () => {
    console.log('Database connected...');
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false, 
    store: MongoDbstore.create({
        mongoUrl:url
    }),
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour 
}))
app.use(flash())

app.use(express.static('public'));
app.use(express.json())

// Global middleware 
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

// app.listen(PORT , () => {
//     console.log(`Listening on port ${PORT}`)
// })