var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')))// viewed at http://localhost:8080

app.get('public', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});





app.listen(8080);
    //res.sendFile(path.join(__dirname + '/svg/gamepad-icon.svg'));
    //res.sendFile(path.join(__dirname + '/svg/trophy-icon.svg'));