const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//use middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwxug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)



async function run() {
    try {
        await client.connect();
        carInventory = client.db('autoRoyal').collection("inventory");

        //get inventory
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = carInventory.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        });
        //get inventory by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await carInventory.findOne(query);
            res.send(inventory);
        });
        //delivered quantity
        app.put('/delivered/:id', async (req, res) => {
            const id = req.params.id;
            const deliveredQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: parseInt(deliveredQuantity.quantity) - 1

                }
            };
            console.log('inventory is');
            const result = await carInventory.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        //update quantity
        app.put("/restock/:id", async (req, res) => {
            const id = req.params.id;
            const inventory = req.body;
            // const restock = database.collection("inventory");
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: inventory.quantity,
                },
            };
            const result = await carInventory.updateOne(filter, updateDoc, options);

            res.send(result);
            console.log(result);
        });

        //delete product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carInventory.deleteOne(query);
            res.send(result);
        });
        //add products
        app.post('/addCar', async (req, res) => {
            const newCar = req.body;
            const result = await serviceCollection.insertOne(newCar);
            res.send(result);
        });

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my autoRoyal heroku Server');
})

app.listen(port, () => {
    console.log('autoRoyal Server is running');
})
