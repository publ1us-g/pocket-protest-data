var readline = require('readline');
var googleAuth = require('google-auth-library');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var sprintf = require("sprintf-js").sprintf;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
module.exports.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
module.exports.TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
module.exports.TOKEN_PATH = module.exports.TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
module.exports.authorize = function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(module.exports.TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
module.exports.getNewToken = function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
module.exports.storeToken = function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

module.exports.cacheSize = cacheSize = 150;
module.exports.csvFileName = csvFileName = sprintf("cached-%s.csv", cacheSize);

module.exports.responseHandler = function errHandler(err, response) {
    if (err) {
        console.log('The API returned an error: ' + err);
        return;
    }
    var rows = response.values;
    if (rows.length == 0) {
        console.log('No data found.');
    } else {
        console.log("Request returned %s rows; converting to ISO 8601 date strings.\n",
          // Last row is empty
          (rows.length - 1));

      var standardWriter = csvWriter({ headers: ["iso8601date", "Member","Party","State","District","Meeting Type","Date","Time","Time Zone",
          "Location","Street Address","City","State","Zip"]});
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
            }
            catch(error){
              malformedRows++;
              errorWriter.write([i, 'Error converting row to an ISO 8601 string'])
            }
            var modifiedRow = row.unshift(iso8601string);
            standardWriter.write(row);
        }

      standardWriter.end();
      errorWriter.end();

      console.log("Data massaging complete.  Column 1 of '%s' holds modified values.\n", csvFileName);

      console.log('Some errors did occur (%s of %s rows).  See %s for details.\n\n', malformedRows,
        // Last row is empty
        (rows.length - 1),
        errorOutputFile);
    }
}