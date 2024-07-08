const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient,ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'amar';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to MongoDB function
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    return client.db(dbName);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Submit endpoint to create a new post
app.post('/submit', async (req, res) => {
  const { title, file, content } = req.body;
  console.log('Received Post Data:');
  console.log('Title:', title);
  console.log('File:', file);
  console.log('Content:', content);

  try {
    const db = await connectToMongo();
    const collection = db.collection("posts");
    const result = await collection.insertOne({ Postname: title, fileid: file, description: content, comments:{ } });
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    res.send('Received Post Data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting document');
  } finally {
    // await client.close();
  }
});

// Route to add comments
app.post('/addcomments', async (req, res) => {
  const { postId, username, comment } = req.body;
  console.log('Post ID:', postId);
  console.log('New Comment:', comment);
  console.log('username:', username);

  try {
    const db = await connectToMongo();
    const collection = db.collection('posts');
    
    // Update the document with postId
    const result = await collection.updateOne(
      { _id: new ObjectId(postId) }, // Assuming postId is a valid MongoDB ObjectId
      { $set: {
        [`comments.${username}`]: comment  // Dynamically set the nested field
      } }, // Add new comment
    );
    
    console.log(`Document updated with postId: ${postId}`);
    res.send('Comment added successfully');
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Error adding comment');
  } finally {
    // No need to close the client here, it's managed elsewhere
  }
});

// Endpoint to respond with all posts when 'hello' message is received
app.get('/hello', async (req, res) => {
  try {
    const db = await connectToMongo();
    const collection = db.collection("posts");
    const posts = await collection.find({}).toArray();
    // console.log(posts);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving posts');
  } finally {
    await client.close();
  }
});

app.get('/validation', async (req, res) => {
  try {
    const db = await connectToMongo();
    const collection = db.collection("user_profiles");
    const users = await collection.find({}).toArray();
    console.log(users);
    res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving posts');
    } finally {
        await client.close();
    }
});

// Submit endpoint to create a new post
app.post('/saveprofile', async (req, res) => {
  const { name, email, pass } = req.body;
  console.log('Received Post Data:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Pass:', pass);

  try {
    const db = await connectToMongo();
    const collection = db.collection("user_profiles");
    const result = await collection.insertOne({ name: name, email: email, pass: pass });
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    res.send('Received Post Data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting document');
  } finally {
    // await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});