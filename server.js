var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', 3001);
app.set('root', __dirname);
app.use(express.static(app.get('root') + '/public'));

app.get('/', function(req, res) {
	res.sendFile(app.get('root') + '/views/index.html');
});

http.listen(app.get('port'), function() {
	console.log('listening on *:', app.get('port'));
});