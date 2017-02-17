var restify = require('restify');
var plugins = require('restify-plugins');
var Q = require('q');
var fs = require('fs');

var sheetCommon = require('./lib/google-sheet-common');
var writeOutputToFile = require('./lib/file-common').writeOutputToFile;
var requestSheetValues = require('./retrieve-data').requestSheetValues;

const returnMassageData = true;

const server = restify.createServer({
  name: 'pocket-protest-data',
  version: '1.0.0'
});
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

// Leaving this here as a sanity check
server.get('/echo/:name', function (req, res, next) {
  res.send(JSON.stringify({
    name: req.params[0],
    currentDate: new Date()
  }));
  return next();
});

// The meat of our application
server.get('/townhall-massaged', function (req, res, next){
  /*
  FIXME: The next block of code (callback hell) should be externalized into a module.
          Doing so will allow it to be called via the CLI or RESTFUL API.
  */

// Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, authToken) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    sheetCommon.authorize(JSON.parse(authToken), function(authToken){
      var responseWriter = null;
      var deferred = Q.defer();

      requestSheetValues(authToken)
        .then(function(rows){

          var retVal = writeOutputToFile(rows, returnMassageData);
          if (returnMassageData) {
            res.send(retVal);
            return next();
          }

        })
        .catch(function (error) {
          // TODO: Handle any error from all above steps
          console.error("Error handling request!", error);
        })
        .done();
    });
  });

});

server.on('InternalError', function (req, res, err, cb) {
  console.error(err);
  err.body = 'something is wrong!';
  return cb();
});

server.on('uncaughtException', function (req, res, route, err) {
  console.log('uncaughtException', err.stack);
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
