#!/usr/bin/env node

var google = require('googleapis');
var sheets = google.sheets('v4');
var sprintf = require("sprintf-js").sprintf;
var Q = require('q');

// local modules
var sheetCommon = require('./google-sheet-common');
var cacheSize = require('./globals').cacheSize;
var writeOutputToFile = require('./file-common').writeOutputToFile;

function googleSheetResponseHandler(err, response, deferred) {
  console.log("Handling response from Google sheets request.");
  var retVal = null;
  if (err) {
    console.log('The API returned an error: ' + err);
  }
  var rows = response.values;
  if (rows.length === 0) {
    console.log('No data found.');
  } else {
    console.log("Request returned %s rows; converting to ISO 8601 date strings.\n",
      // Last row is empty
      (rows.length - 1));

    deferred.resolve(rows);
  }
  return deferred.promise;
}

module.exports.requestSheetValues = function requestSheetValues(authToken) {
  var deferred = Q.defer();
  var offset = 12;
  var endIndex =  offset + cacheSize;
  var townHallConfig = {
    auth: authToken,
    // We'd expect to use "Upcoming Events!H12:I94", but it seems
    // that construct breaks the API.  Instead, use a null value.

    /**
     * H : Date
     * I : Time
     *
     * range: '!H12:I94', // Specifically the data and time columns
     */
    range: sprintf('Upcoming Events!C%s:U%s', offset, endIndex), // Entire data set
    spreadsheetId: '1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA'
  };


  // Pick one
  var config = townHallConfig;
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA';
  console.log('\nRetrieving data from the "Town Hall Project 2018" Google sheet.  Available online: \n\t%s .\n',
    sheetUrl);

  console.log("Attempting to parse spreadsheet range : %s\n", townHallConfig.range.substring(1));

  sheets.spreadsheets.values.get(config, function(err, response) {
      googleSheetResponseHandler(err, response, deferred);
    }
  );

  return deferred.promise;
};
