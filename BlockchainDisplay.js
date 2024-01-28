var http = require('http');
var fs = require('fs');



http.createServer(function (req, res) {

  //Open a file on the server and return its content:
  fs.readFile('./Data/BlockchainFile_0.txt', function(err, data) {
    
    res.writeHead(200, {'Content-Type':  'application/json'});
    //let d1= data.substring(1,data.length-1);
    let d=String(data);
    const lines = d.split("\n");

  // print all lines
  lines.forEach(line => {
  let m=JSON.parse(line);
  console.log(m);
    res.write(line);
    //console.log(line)
  });
    
    return res.end();
  });
}).listen(8080);

