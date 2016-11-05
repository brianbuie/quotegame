var http = require('http');

var port = 80;

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Bears. Beets. Battlestar Galactica.\n");
});

server.listen(port);

console.log("Server running on port " + port);