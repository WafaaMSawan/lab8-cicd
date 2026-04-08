const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017';
const DB_NAME = 'tasksdb';
let db;

async function connectWithRetry() {
  const client = new MongoClient(MONGO_URL);
  let retries = 10;
  while (retries > 0) {
    try {
      await client.connect();
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB');
      const count = await db.collection('tasks').countDocuments();
      if (count === 0) {
        await db.collection('tasks').insertMany([
          { id: 1, name: 'Buy groceries', status: 'pending' },
          { id: 2, name: 'Walk the dog',  status: 'done'    },
          { id: 3, name: 'Read a book',   status: 'pending' },
          { id: 4, name: 'Write report',  status: 'done'    },
          { id: 5, name: 'Call dentist',  status: 'pending' },
          { id: 6, name: 'Fix bug',       status: 'pending' },
        ]);
        console.log('Database seeded');
      }
      return;
    } catch (err) {
      console.log(`Waiting for MongoDB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  process.exit(1);
}

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks')
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

connectWithRetry().then(() => {
  app.listen(port, () => console.log(`App on port ${port}`));
});