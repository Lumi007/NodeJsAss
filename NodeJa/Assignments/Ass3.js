const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response header with the content type
  res.setHeader('Content-Type', 'text/plain');
  
  // Write the response body
  res.end('Hello world');
});

// Set the port number for the server to listen on
const port = 3000;

// Start the server and make it listen on the specified port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
