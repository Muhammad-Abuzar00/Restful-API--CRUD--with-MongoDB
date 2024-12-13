const express=require('express');
const mongoose=require('mongoose');
const Item=require('./model');
const cors = require('cors');


const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Item')
.then(()=>console.log('Database Connected'))
.catch(()=>console.log('Connection failed'));

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the RESTful API!</h1><p>Use the available endpoints to perform CRUD operations.</p>');
  });

app.get('/items',async(req,res)=>{
    try {
        const items = await Item.find();
        res.status(200).json(items);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items.' });
      }
});

app.post('/items', async (req, res) => {
    try {
      const newItem = new Item(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create the item.' });
    }
  });

app.get('/items/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found.' });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
      const updatedItem = await item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ error: 'Item not found.' });
      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update the item.' });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Item not found.' });
      res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete the item.' });
    }
});



app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
  });