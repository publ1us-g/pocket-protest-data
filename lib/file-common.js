var csvWriter = require('csv-write-stream');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');

var cacheSize = require('./globals').cacheSize;

module.exports.csvFileName = csvFileName = sprintf("cached-%s.csv",
  cacheSize);

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
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];

    var localDate = row[5];
    var localTime = row[6];
    var timezone = row[7];
    var date = new Date(localDate + ", " + localTime + ", " + timezone);
    var iso8601string = "NULL";
    try {
      iso8601string = date.toISOString();

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
      var errMsg = 'Error converting row to an ISO 8601 string';
      console.error(errMsg, error);
      malformedRows++;
      errorWriter.write([i, errMsg]);
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