var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080

// Add more movies! (For a technical challenge, use a file, or even an API!)
var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange', 'Space Jam', 'The Illusionist']

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    // Note the new case handling search
    case '/search':
      handleSearch(res, uri)
      break
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    case '/':
      sendIndex(res, movies)
      break
    case '/index.html':
      sendIndex(res, movies)
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
    default:
      res.end('404 not found')
  }

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// subroutines

// You'll be modifying this function
function handleSearch(res, uri) {
  var contentType = 'text/html'
  res.writeHead(200, {'Content-type': contentType})

  if(uri.query) {
    // PROCESS THIS QUERY TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    console.log( uri.query )
    var results = []
    var term = uri.query.substring(7,uri.query.length).toLowerCase().replace("+", " ");
    for(var i = 0; i < movies.length; i++){
       if(movies[i].toLowerCase().indexOf(term) > -1){
           results.push(movies[i])
       }
    }
    sendIndex(res,results)
  } else {
    res.end('no query provided')
  }
}

// Note: consider this your "index.html" for this assignment
function sendIndex(res, list) {
  var contentType = 'text/html'
    , html = ''

  html = html + '<html>'

  html = html + '<head>'
  html = html + '<script src="https://use.fontawesome.com/53cba9084c.js"></script>'
  html = html + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
  html = html + '<link rel="stylesheet" type="text/css" href="css/style.css"/>'
  html = html + '</head>'

  html = html + '<body OnLoad="document.myform.search.focus();">'
  html = html + '<div class="container-fluid">'

  html = html + '<div class="jumbotron">'
  html = html + '<h1>Movie Search!</h1>'

  // Here's where we build the form YOU HAVE STUFF TO CHANGE HERE

  html = html + '<div class="input-group">'
  html = html + '<form action="search" name="myform" method="TODO">'
  html = html + '<input type="Search" placeholder="Search..." name="search" />'
  html = html + '<button class="btn btn-default" type="TODO"><i class="fa fa-search" ></i></button>'
  html = html + '</form>'
  html = html + '</div>'
  html = html + '</div>'

  html = html + '<div class="element">'
  html = html + '<ul>'
  // Note: the next line is fairly complex. 
  // You don't need to understand it to complete the assignment,
  // but the `map` function and `join` functions are VERY useful for working
  // with arrays, so I encourage you to tinker with the line below
  // and read up on the functions it uses.
  //
  // For a challenge, try rewriting this function to take the filtered movies list as a parameter, to avoid changing to a page that lists only movies.
  html = html + getList(list)
  html = html + '</ul>'
  html = html + '</div>'
  html = html + '</div>'

  html = html + '</body>'
  html = html + '</html>'
  
  res.writeHead(200, {'Content-type': contentType})
  res.end(html, 'utf-8')
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}

function getList(arrName){

    return '<ul class="list-group">' + arrName.map(function(d) { return '<li class="list-group-item">'+d+'</li>' }).join(' ') + '</ul>'



}
