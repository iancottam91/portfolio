var express = require('express');
var app = express();


// app.set('port', process.env.PORT || 3001);

app.use('/assets', express.static(__dirname + '/assets'));

/* serves all the static files */

app.get('*', function(req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


app.listen(process.env.PORT || 80);

// app.get('/ab(cd)?e', function(req, res) {
//  res.send('ab(cd)?e');
// });

