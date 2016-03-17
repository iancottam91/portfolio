var express = require('express');
var favicon = require('serve-favicon');
var app = express();



app.use('/assets', express.static(__dirname + '/assets'));

app.use(favicon(__dirname + '/assets/img/favicon.ico'));

/* serves all the static files */

app.get('/', function(req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// handle 404 errors
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


app.listen(process.env.PORT || 80);

// app.get('/ab(cd)?e', function(req, res) {
//  res.send('ab(cd)?e');
// });

