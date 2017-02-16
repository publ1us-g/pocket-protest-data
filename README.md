# pocket-protest-data

Data resources to support https://pocketprotest.org

[![Greenkeeper badge](https://badges.greenkeeper.io/publ1us-g/pocket-protest-data.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/publ1us-g/pocket-protest-data.svg?branch=master)](https://travis-ci.org/publ1us-g/pocket-protest-data)

## Usage
Currently, this repository offers one feature: massaging "[Town Hall Project 2018]" Google sheet data and writing out
dates as ISO-8601 strings.  To run the application :



```shell
### Step 1 -- Clone the repository
git clone https://github.com/publ1us-g/pocket-protest-data.git
cd pocket-protest-data

### Step 2 -- Obtain or create a client_secret.json file, used to authenticate to Google services
###           This file may be provided by someone on your team.  If you don't already have this 
###           file, follow this guide to create your own:
###             https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the_api_name

### Step 3 -- Install NodeJS dependencies and run the tool
npm install
npm run retrieve-data
```

## Roadmap
1. Refactor to restify application

## Learning Resources
The following resources were used to create this project and may provide useful information :
- https://developers.google.com/sheets/api/quickstart/nodejs


[Town Hall Project 2018]: https://docs.google.com/spreadsheets/d/1yq1NT9DZ2z3B8ixhid894e77u9rN5XIgOwWtTW72IYA