var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.set('port', (process.env.PORT || 3500));
// app.listen(process.env.PORT || 3500);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
