var csvWriter = require('csv-write-stream');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');

var zipcodes = require("zipcodes");
var tzwhere = require('tzwhere');
var moment = require('moment-timezone');

var cacheSize = require('./globals').cacheSize;

tzwhere.init();

module.exports.csvFileName = csvFileName = sprintf("cached-%s.csv",
  cacheSize);

function timezoneFromZip(row){
  var zipCode = row[16];
  var place = zipcodes.lookup(zipCode);
  var timezone = tzwhere.tzNameAt(place.latitude, place.longitude);
  console.log("Determined that '" +
    row[14] + ", " + row[15] +
    "' is in timezone: '" +
    timezone +
    "'");
  return timezone;
}

module.exports.writeOutputToFile = function writeOutputToFile(rows, returnMassageData){

  var columnNames = ["iso8601date", "Member","Party","State","District","Meeting Type","Date","Time","Time Zone",
    "Location","Street Address","City","State","Zip"];

  var massagedData = [];

  var standardWriter = csvWriter({ headers: columnNames});
  standardWriter.pipe(fs.createWriteStream(csvFileName));

  var errorWriter = csvWriter({ headers: ["Input row", "Problem"] });
  var errorOutputFile = "input-errors.csv";
  errorWriter.pipe(fs.createWriteStream(errorOutputFile));

  var malformedRows = 0;
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];

    var localDate = row[9];
    var localTime = row[10];

    var timezone = null;
    try {
      timezone = timezoneFromZip(row);
    }
    catch(error){
      var errMsg = 'Error determining protest location';
      console.error(errMsg, error);
      malformedRows++;
      errorWriter.write([i, errMsg]);
      // Can't proceed without a timezone
      continue;
    }

    var momentInNewYork    = moment(localDate + " " + localTime).tz("America/New_York");
    var momentWithTimezone    = moment(localDate + " " + localTime).tz(timezone);

    var iso8601string = "NULL";
    try {
      iso8601string = momentInNewYork.toISOString();

      row.unshift(iso8601string);
      if(returnMassageData){
        var obj = {};
        for (var c = 0; c <= columnNames.length; c++){
          obj[columnNames[c]] = row[c];
        }
        massagedData.push(obj);
      }

    }
    catch(error){
      var conversionError = 'Error converting row to an ISO 8601 string';
      console.error(conversionError, error);
      malformedRows++;
      errorWriter.write([i, conversionError]);
    }

    standardWriter.write(row);
  }

  standardWriter.end();
  errorWriter.end();

  console.log("Data massaging complete.  Column 1 of '%s' holds modified values.\n", csvFileName);

  console.log('Some errors did occur (%s of %s rows).  See %s for details.\n\n', malformedRows,
    // Last row is empty
    (rows.length - 1),
    errorOutputFile);

  return massagedData;
};