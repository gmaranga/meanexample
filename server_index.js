var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);
require('./dependencies')(wagner);

var app = express();

wagner.invoke(require('./auth'), { app: app });

app.use('/api/v1', require('./api')(wagner));

app.listen(process.env.PORT);
console.log('Listening on port ' + process.env.PORT +'!');
