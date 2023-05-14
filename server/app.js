require('express');
require('./db/dbConnect');
const App = require('./config/server-config');

const app = new App();

app.start();
