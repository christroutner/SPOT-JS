// 4/13/15 CT
// This version retrieves the latest data and appends it to the SolaceSPOTData.csv file. 
// This is a Node.js program.
// You'll need the following node modules:
// --fast-csv
// --node-xml-lite

// Program has the following layout:
// 1) Load the master CSV list into memory.
// 2) Retrieve the latest XML data.
// 3) Add New Data to Existing Data.
// 4) Save Data

var https = require('https');
var fs = require('fs');
//var xml2js = require('xml2js');
var xmllib = require("node-xml-lite");
var csv = require('fast-csv');

//Global Variables
var FeedID = "0n1DuvcKbXUAQJ2GPB7OC3lTXd57CjSuc";  //Replace this with the FeedID of your SPOT tracker.
var i = 0;
var j = 0;
var MasterData = [];

// 1) Load the master CSV list into memory
var stream = fs.createReadStream("C:\\Users\\Administrator\\Documents\\SolaceSPOTData.csv");

csv
 .fromStream(stream, {ignoreEmpty: true})
 .on("data", function(data){    
     //Copy the CSV data to a two dimensional array.
     MasterData[i] = data;
     i++;
     
 })
 .on("end", function(){
     console.log("done");
 });


// 2) Retrieve the latest XML data.

//Retrieve the latest message:
//https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0n1DuvcKbXUAQJ2GPB7OC3lTXd57CjSuc/latest.xml
//Retrieve the last 50 messages:
//http://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0n1DuvcKbXUAQJ2GPB7OC3lTXd57CjSuc/message.xml

var req = https.get("https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/"+FeedID+"/message.xml", function(res) {
  
  //HTTPS Info
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);
  
  // save the data
  var xml = '';
  res.on('data', function(chunk) {
    xml += chunk;
  });

  res.on('end', function() {
    
    //Handle errors
    if (xml == null || xml=='') {
      console.log("XML is empty! Nothing was recieved from the SPOT server.\n");
    }
    else {    
      
      //Parse the XML from the SPOT server.
      xmlroot = xmllib.parseString(xml);
      
      //Loop through each message entry in the XML file
      var entries = xmlroot.childs[0].childs[4].childs.length;
      
      var unixtime, latitude, longitude, datetime;
      var SPOTData = [];
      var temparray = [];
      var dupedata = false;
      
      //Loop through the XML data and fill in the array of SPOT data.
      //3) Add New Data to Existing Data.
      for(i = entries-1; i >= 0; i--) {

        unixtime = xmlroot.childs[0].childs[4].childs[i].childs[3].childs[0].toString();
        latitude = xmlroot.childs[0].childs[4].childs[i].childs[5].childs[0].toString();
        longitude = xmlroot.childs[0].childs[4].childs[i].childs[6].childs[0].toString();
        datetime = xmlroot.childs[0].childs[4].childs[i].childs[9].childs[0].toString();
        
        //Make sure the current unixtime does not exist in the Master Data.
        for(j = 0; j < MasterData.length; j++) {
          if( unixtime === MasterData[j][0] ) {

            //If duplicate data is dectect, mark it so.
            dupedata = true;
            break;
          }
        }

        //Skip this data point if a duplicate was detected.
        if( dupedata ) {
          dupedata = false;
          continue;
        }
        //Save the data point into the MasterData array.
        else {
          temparray = [unixtime, latitude, longitude, datetime];
          
          MasterData.push(temparray);
          
        }
      }
      
      // 4) Save Data
      //Write out the SPOT data as a CSV file using the fast-csv library.
      var ws = fs.createWriteStream("C:\\Users\\Administrator\\Documents\\SolaceSPOTData.csv");
      csv.write(MasterData, {headers: false}).pipe(ws);
      
    }
  });


});

req.on('error', function(err) {
  // debug error
  console.log('problem with request: ' + e.message);
});




