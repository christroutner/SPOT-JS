# SPOT-JS
SPOT-JS is open source JavaScript code to download and display SPOT tracker data. There is a Server and Client component to the software. The Server uses the Node.js compiler to execute a JavaScript program that downloads the SPOT data from the SPOT server and saves it as a CSV file. The Client is web-page Javascript that downloads the CSV file from the Server and displays the data in the browser using the Google Maps API.

The code in this project is meant only to be a functional example. Not much time has been spent on error handling in an effort to keep the code simple and straitforward. It's not turn-key code, but an example for you to start with.


Notes on setting up the Server:
-------------------------------
-The only file in this repository that goes on the Server is SPOT-JS-Server.js. The server will need Node.js setup and the support libraries installed (mentioned in the .js file comments).

-The Server needs to run the code as a cron job (linux) or use Task Scheduler (windows) to execute the program periodically to download new data. The SPOT server will only store the last 50 data points. If the data is not downloaded by the Server by the time a new 50 data points comes along, it will be lost.

-The Web Server needs to be configured to issue a valid HTTP Response Header in order for the Client code to download the CSV file. It needs to return the response header 'Access-Control-Allow-Origin' with a value of '*'.


Notes on setting up the Client:
-------------------------------
-The client code runs in a web browser. Example code is in the test-SPOT.html file. It's been tested with Chrome v42.

-There is a scripts directory in this repository containing required libraries. There is also a png file used as an icon for the GPS points. This can be changed at the top of the client example program.
