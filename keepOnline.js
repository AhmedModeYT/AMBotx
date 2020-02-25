/*var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('page'));
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

console.log("Loading")
*/