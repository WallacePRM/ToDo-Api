const express = require('express');
const cors = require('cors');

const account = require('./account');
const tasks = require('./tasks');

const app = express();
const port = process.env.PORT || 500;

app.use(express.json());
app.use(cors());

account.createRouters(app);
tasks.createRouters(app);

exports.startServer = (port, () => {
    app.listen(port, () => {

        console.log('SERVER ON ' + port);
    });
});