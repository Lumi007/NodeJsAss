const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());

const dataFilePath = path.join(__dirname, 'items.json');


// Add a new Item to the inventory

app.post('/api/items', (req, res) => {
  // Create new item
  const newItem = req.body;
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const items = JSON.parse(data);
      newItem.id = Date.now(); // You can generate IDs more robustly in production
      
      items.push(newItem);
      
      fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json(newItem);
        }
      });
    }
  });
});


// Get all items from  the inventory

app.get('/api/items', (req, res) => {
  // Get all items
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const items = JSON.parse(data);
      res.status(200).json(items);
    }
  });
});

app.get('/api/items/:id', (req, res) => {
  // Get item by ID
  const itemId = parseInt(req.params.id);
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const items = JSON.parse(data);
      const item = items.find(item => item.id === itemId);
      
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    }
  });
});


// Update an item in the inventory

app.put('/api/items/:id', (req, res) => {
  // Update item by ID
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const items = JSON.parse(data);
      const index = items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        
        fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json(items[index]);
          }
        });
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    }
  });
});

// Delete an item from the inventory

app.delete('/api/items/:id', (req, res) => {
  // Delete item by ID
  const itemId = parseInt(req.params.id);
  
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const items = JSON.parse(data);
      const index = items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        items.splice(index, 1);
        
        fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(204).send();
          }
        });
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}/`);
});
