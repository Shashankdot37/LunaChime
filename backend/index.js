require('dotenv').config({ path: '.env' });
const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const port = 5000;

var app = express();

app.use(express.json());

app.use('/auth', require('./router/auth'));
app.use('/profile',require('./router/profile'));
app.use('/post',require('./router/post'));
app.use('/institute',require('./router/institute'));

app.listen(port, ()=>
{
    console.log("Backend listening to port: ", port);
})