const express = require('express');
const fs = require('fs');
const path = require('path');
const apiKey = require('apikey');

const app = express();
const port = 3001;

app.use(express.json());
app.use(apiKey.check());

const dataFilePath = path.join(__dirname, 'items.json');
const usersFilePath = path.join(__dirname, 'users.json');

// Load users from file
let users = [];
fs.readFile(usersFilePath, 'utf8', (err, data) => {
  if (!err) {
    users = JSON.parse(data);
  }
});

// Middleware for authentication
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find(user => user.apiKey === apiKey);
  if (!user) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
}

// Middleware for authorization
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;

  // Check for duplicate username
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = { username, password, role, apiKey: username }; // Using username as apiKey for simplicity
  users.push(newUser);

  // Update users file
  fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ apiKey: user.apiKey });
});

app.post('/api/items', authenticateApiKey, authorize('admin'), (req, res) => {
  // Create new item
  const newItem = req.body;
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const items = JSON.parse(data);
    newItem.id = Date.now().toString(); // Generating an ID based on timestamp
    items.push(newItem);

    fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(201).json(newItem);
    });
  });
});

app.get('/api/items', authenticateApiKey, (req, res) => {
  // Get all items
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const items = JSON.parse(data);
    res.status(200).json(items);
  });
});

app.get('/api/items/:id', authenticateApiKey, (req, res) => {
  // Get item by ID
  const itemId = req.params.id;
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const items = JSON.parse(data);
    const item = items.find(item => item.id === itemId);
    
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

app.put('/api/items/:id', authenticateApiKey, authorize('admin'), (req, res) => {
  // Update item by ID
  const itemId = req.params.id;
  const updatedItem = req.body;
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const items = JSON.parse(data);
    const index = items.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };

      fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(items[index]);
      });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

app.delete('/api/items/:id', authenticateApiKey, authorize('admin'), (req, res) => {
  // Delete item by ID
  const itemId = req.params.id;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const items = JSON.parse(data);
    const index = items.findIndex(item => item.id === itemId);

    if (index !== -1) {
      items.splice(index, 1);

      fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(204).send();
      });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}/`);
});
