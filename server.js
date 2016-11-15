var http = require('http')
  , url = require("url")
  , fs = require("fs")
  , qs = require('querystring')

var server = http.createServer( function (req, res) {

  // read classes file
  // todo
  var classes = 
    fs.readFileSync('movies.txt', 'utf8')
      .toString()
      .trim()
      .split("\n");

  // handle POST to update file
  var d = '';
  req.on('data', function(c) {
    d = d+c
  })
  req.on('end', function() {
    if(d != '') {
      var q = qs.parse(d)
      if(q.newclass) {
        classes.push( q.newclass )
        fs.writeFileSync('movies.txt', classes.join('\n'))
      }
    }
    d = ''
    serveIndex(classes, res)
  })

});

var serveIndex = function(classes, res){
  res.writeHead(200, {"Content-Type": "text/html"});

  res.write("<html>");
  res.write("<body>");

  res.write("<h2>My current classes are</h2>");
  classes.forEach(function(d) {
    res.write("<p>" + d + "</p>");
  });

  res.write("<form method=\"post\">");
  res.write("<label for=\"newclass\" > Add New Class</label>");
  res.write("<input id=\"newclass\" name=\"newclass\" type=\"text\">");
  res.write("<button type=\"submit\">Submit</button>")
  res.write("</form>");


  res.write("</body>");
  res.write("</html>");
  res.end()};

server.listen(process.env.PORT || 8080);
console.log("Server is listening on 8088");
