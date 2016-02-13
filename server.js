var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
