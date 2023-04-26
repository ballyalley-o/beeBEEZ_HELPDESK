const express = require('express');
const mongoose = require('./db/dbConnect');
const App = require('./config/server-config');

const app = new App();


app.start();


