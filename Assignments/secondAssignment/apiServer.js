const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/api/items') {
    if (method === 'GET') {
      // Get all items
      const filePath = path.join(__dirname, 'items.json');
      
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    } else if (method === 'POST') {
      // Create new item
      // Read request data and update items.json file
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  } else if (url.startsWith('/api/items/')) {
    const itemId = url.split('/').pop();
    
    if (method === 'GET') {
      // Get item by ID
      // Read items.json and find the item by ID
    } else if (method === 'PUT') {
      // Update item by ID
      // Read request data, update items.json and send response
    } else if (method === 'DELETE') {
      // Delete item by ID
      // Read items.json, remove the item by ID, update the file and send response
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '404 Not Found' }));
  }
});

server.listen(3001, () => {
  console.log('API server running at http://localhost:3001/');
});
