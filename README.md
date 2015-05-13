# SPOT-JS
SPOT-JS is open source JavaScript code to download and display SPOT tracker data. There is a Server and Client component to the software. The Server uses the Node.js compiler to execute a JavaScript program that downloads the SPOT data from the SPOT server and saves it as a CSV file. The Client is web-page Javascript that downloads the CSV file from the Server and displays the data in the browser using the Google Maps API.

The code in this project is meant to only a functional example. Not much time has been spent on error handling in an effort to keep the code simple and straitforward. It's not turn-key code, but an example for people to start with.


Notes on setting up the Server:
-------------------------------
-The Server needs to run the code as a cron job (linux) or use Task Scheduler (windows) to execute the program periodically to download new data. The SPOT server will only store the last 50 data points. If the data is not downloaded by the time a new 50 data points comes along, it will be lost.

-The Web Server needs to be configured to issue a valid HTTP Response Header in order for the Client code to download the CSV file. It needs to return the response header 'Access-Control-Allow-Origin' with a value of '*'.
