const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());




const uri = "mongodb+srv://todo_db:cTxdR9CYhvEtBoaF@cluster0.bkphobz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const run = async () => {
    try {

        await client.connect();

        const todosCollection = client.db("todo").collection("todos");



        // Post Todos
        app.post('/todos', async (req, res) => {
            const todo = req.body;
            const result = await todosCollection.insertOne(todo);
            res.send(result);
        })

        // Get Todos
        app.get('/todos', async (req, res) => {
            const query = {};
            const todos = todosCollection.find(query);
            const result = await todos.toArray();
            res.send(result);
        })

        // Update Todos
        app.patch('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const body = req.body;
            const updateDoc = {
                $set: {
                    title: body.title,
                    description: body.description
                },
            };
            const update = await todosCollection.updateOne(query, updateDoc)
            res.send(update);
        })


        // Delete Todos
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await todosCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Running React ToDo App Server");
});

app.listen(port, () => {
    console.log("Listen to Port", port);
});







