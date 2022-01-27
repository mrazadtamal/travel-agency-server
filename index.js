const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carSell");

    // get cars data
    app.get("/cars", async (req, res) => {
      try {
        const cursor = carsCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    // get single car data
    app.get("/carsData/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      try {
        const singleData = await carsCollection.findOne({ _id: ObjectId(id) });
        res.json(singleData);
      } catch (err) {
        console.log(err);
      }
    });

    //  post order
    app.post("/orders", async (req, res) => {
      const data = req.body;
      try {
        const result = await allOrderCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    //  add a product
    app.post("/cars", async (req, res) => {
      const data = req.body;
      try {
        const result = await carsCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    //  get get single order
    app.get("/orders/:email", async (req, res) => {
      const { email } = req.params;
      try {
        const result = allOrderCollection.find({ email: email });
        const data = await result.toArray();
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    });

    // single order delete
    app.delete("/orderDelete/:id", async (req, res) => {
      const { id } = req.params;
      try {
        await allOrderCollection.deleteOne({ _id: ObjectId(id) });
        res.status(200).json({ message: "successly deleted" });
      } catch (err) {
        console.log(err);
      }
    });

    // single Products delete
    app.delete("/productDelete/:id", async (req, res) => {
      const { id } = req.params;
      try {
        await carsCollection.deleteOne({ _id: ObjectId(id) });
        res.status(200).json({ message: " deleted" });
      } catch (err) {
        console.log(err);
      }
    });

    //  add review
    app.post("/review", async (req, res) => {
      const data = req.body;
      try {
        const result = await reviewCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get reviews

    app.get("/reviews", async (req, res) => {
      try {
        const cursor = reviewCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    // get all orders
    app.get("/orders", async (req, res) => {
      try {
        const cursor = allOrderCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    //  Make an Admin
    app.post("/admin", async (req, res) => {
      const data = req.body;

      try {
        const result = await adminCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get admin
    app.get("/admin", async (req, res) => {
      try {
        const cursor = adminCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("travel-agency");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
