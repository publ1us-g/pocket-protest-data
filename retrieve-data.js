#!/usr/bin/env node

var fs = require('fs');
var google = require('googleapis');
var sheets = google.sheets('v4');
var sheetCommon = require('./lib/google-sheet-common');
var sprintf = require("sprintf-js").sprintf;


// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    sheetCommon.authorize(JSON.parse(content), getSheetValues);
    // Alternate
    //sheetCommon.authorize(JSON.parse(content), getSheetMetadata);
});

function getSheetValues(auth) {
  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  var studentConfig = {
      auth: auth,
      range: 'Class Data!A2:E',
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  };

  var offset = 12;
  var endIndex =  offset + sheetCommon.cacheSize;
  var townHallConfig = {
      auth: auth,
      // We'd expect to use "Upcoming Events!H12:I94", but it seems
      // that construct breaks the API.  Instead, use a null value.

    /**
     * H : Date
     * I : Time
     *
     * range: '!H12:I94', // Specifically the data and time columns
     */
    range: sprintf('!C%s:P%s', offset, endIndex), // Entire data set
    spreadsheetId: '1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA'
  };


  // Pick one
  var config = townHallConfig;
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA';
  console.log('\nRetrieving data from the "Town Hall Project 2018" Google sheet.  Available online: \n\t%s .\n'
    , sheetUrl);

  console.log("Attempting to parse spreadsheet range : %s\n", townHallConfig.range.substring(1));

  sheets.spreadsheets.values.get(config, sheetCommon.responseHandler);
}


function getSheetMetadata(auth) {
  var config = {
    auth: auth,
    spreadsheetId: '1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA',
    includeGridData: true
  };

  // Get the whole spreadsheet
  sheets.spreadsheets.get(config, sheetCommon.responseHandler);
}
