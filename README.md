# pocket-protest-data

Web services supporting https://pocketprotest.org , more info: https://twitter.com/pocketprotest

Greenkeeper: [![Greenkeeper badge](https://badges.greenkeeper.io/publ1us-g/pocket-protest-data.svg)](https://greenkeeper.io/)
Travis: [![Travis build badge](https://travis-ci.org/publ1us-g/pocket-protest-data.svg?branch=master)](https://travis-ci.org/publ1us-g/pocket-protest-data)
Wercker: [![Wercker build badge](https://app.wercker.com/status/d240cba818fcbeb74914d5011cd9f48f/s/master "wercker status")](https://app.wercker.com/project/byKey/d240cba818fcbeb74914d5011cd9f48f)


## Usage
This project currently offers one feature: massaging "[Town Hall Project 2018]" Google sheet data and serving it as a REST-ful web service.  You can access the data online: http://138.197.80.213:8080/townhall-massaged .  The data massaging was necessary to provide listing dates in [ISO-8601 format].  

## Primary roadmap
1. Get more people involved 
2. Add REST service to provide upcoming elections (from local school boards all the way up!)  

## Learning material
The following guide was used to create this project and may provide useful information :
- https://developers.google.com/sheets/api/quickstart/nodejs


[Town Hall Project 2018]: https://docs.google.com/spreadsheets/d/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA
[ISO-8601 format]: https://en.wikipedia.org/wiki/ISO_8601
