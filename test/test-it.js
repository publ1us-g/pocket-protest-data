'use strict';
var request = require('request');


// TODO: Add tests of some sort.

// Note, the app is continuously deployed here:
var url = 'http://138.197.80.213:8080/townhall-massaged';

request.get({
    url: url
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('HTTP response status:', res.statusCode);
    } else {
      console.log(data);

      /*


       var response = JSON.parse(data);
       var one = response[0];
       console.log("Original: %s %s %s", one["Date"], one["Time"], one["Time Zone"])
       var isoString = one.iso8601date;
       var asDate = new Date(isoString);
       console.log("Our timezone: %s", asDate);


       var two = response[0];
       console.log("Original: %s %s %s", two["Date"], two["Time"], two["Time Zone"])
       isoString = two.iso8601date;
       asDate = new Date(isoString);
       console.log("Our timezone: %s", asDate);

       */

    }
});
