const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const admin = require("firebase-admin");

const serviceAccount = require("./smart-deals-18e92-firebase-adminsdk-fbsvc-b89bb00644.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const verifyFirabaseToken = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.token_email = decoded.email;

        next();
    }
    catch (error) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zn65wpu.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('WELCOME TO SMART DEALS SERVER');
})

async function run() {
    try {
        await client.connect();

        const db = client.db('smart_deals_db');
        const productsCollection = db.collection('products');
        const bidsCollection = db.collection('bids');
        const usersCollection = db.collection('users');

        // USER REELATED API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email };
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'USER ALREADY EXITS' })
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })

        // PRODUCTS RELATED API
        app.get('/products', async (req, res) => {
            // const projectFields = { title: 1, condition: 1, usage: 1, price_min: 1, price_max: 1, image: 1 }
            // const cursor = productsCollection.find().sort({ price_min: 1 }).skip(3).limit(4).project(projectFields);

            const email = req.query.email;
            const query = {};

            if (email) {
                query.email = email;
            }

            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // sort product
        // limit how many product will show
        // skip first x product then show others
        // projest custom json fields only show specific fields

        app.get('/recent-products', async (req, res) => {
            const cursor = productsCollection.find().sort({ created_at: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        app.post('/products', verifyFirabaseToken, async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                }
            };
            const options = {};
            const result = await productsCollection.updateOne(query, update, options);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        // BIDS RELATED API
        app.get('/bids', verifyFirabaseToken, async (req, res) => {
            const email = req.query.email;
            const query = {};

            if (email) {
                query.buyer_email = email;

                if (email !== req.token_email) {
                    return res.status(403).send({ message: 'forbiden access' });
                }
            }
        

            const cursor = bidsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bidsCollection.findOne(query);
            res.send(result);
        })

        app.get('/products/bids/:id', async (req, res) => {
            const id = req.params.id;
            const query = { product: id };
            const cursor = bidsCollection.find(query).sort({ bid_price: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bids', async (req, res) => {
            const newBids = req.body;
            const result = await bidsCollection.insertOne(newBids);
            res.send(result);
        })

        app.delete('/bids/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bidsCollection.deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('Smart daels server is running on port:', port);
})

// client.connect()
//     .then(() => {
//         app.listen(port, () => {
//             console.log('SMART DEALS SERVER PORT:', port);
//         })
//     })
//     .catch(console.dir)
