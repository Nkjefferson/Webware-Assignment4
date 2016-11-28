var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 3000
  , qs = require('querystring')

// Add more movies! (For a technical challenge, use a file, or even an API!)

  var movies

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  movies = 
    fs.readFileSync('movies.txt','utf8')
    .toString()
    .trim()
    .split("\n");
  var p ='';

  switch( uri.pathname ) {
    // Note the new case handling search
   
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    case '/':
      sendFile(res, 'index.html');
      break
    case '/index.html':
      sendFile(res, 'index.html');
      break
    case '/css/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript')
      break
    case '/README.md':
      sendFile(res, 'README.md', 'utf8')
      break
    case '/movies':
      res.end(movies.toString())
      break
    case '/updateMovie':
      handlePost(req, res);
      break
    case '/search':
      
      res.end(handleSearch(uri))     
      break
    default:
      res.end('404 not found')
  }
});

server.listen(process.env.PORT || port)
console.log('listening on 3000')

// subroutines

// You'll be modifying this function
function handleSearch(uri) {
  

  if(uri.query) {
    // PROCESS THIS QUERY TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    var results = []
    var term = uri.query.substring(7,uri.query.length).toLowerCase().replace("+", " ");
    for(var i = 0; i < movies.length; i++){
       if(movies[i].toLowerCase().indexOf(term) > -1){
           results.push(movies[i])
       }
    }
    return results.toString()
  } 
};

function handlePost(req, res) {
  var body = ''

  req.on('data', function(d) {
    body += d;
  })
  req.on('end', function(d) {

 if(body !=''){
          var post = qs.parse(body)
        if(post.add){
          movies.push(post.add)
        }
        if(post.rem){
          var index = movies.indexOf(post.rem)
          if (index >= 0) {
                movies.splice( index, 1 )
          }
        }
        fs.writeFileSync('movies.txt', movies.sort().join('\n'))
        res.end(movies.toString());


  }

}) 
}

// Note: consider this your "index.html" for this assignment

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  var stream = fs.createReadStream(filename)

  stream.on('data', function(data) {
    res.write(data);
  })

  stream.on('end', function(data) {
    res.end();
    return;
  })

}
