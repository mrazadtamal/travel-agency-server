const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travel");
    const allBlog = database.collection("blogs");
    const admin = database.collection("admin");

    // get all blog data
    app.get("/blogs", async (req, res) => {
      try {
        const cursor = allBlog.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    // get single blog data
    app.get("/blog/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      try {
        const singleData = await allBlog.findOne({ _id: ObjectId(id) });
        res.json(singleData);
      } catch (err) {
        console.log(err);
      }
    });

    //  add blog
    app.post("/addblog", async (req, res) => {
      const data = req.body;
      try {
        const result = await allBlog.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    // single Blog delete
    app.delete("/deleteBlogs/:id", async (req, res) => {
      const { id } = req.params;
      try {
        await allBlog.deleteOne({ _id: ObjectId(id) });
        res.status(200).json({ message: " deleted" });
      } catch (err) {
        console.log(err);
      }
    });

    //  Make an Admin
    app.post("/admin", async (req, res) => {
      const data = req.body;

      try {
        const result = await admin.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get admin
    app.get("/admin", async (req, res) => {
      try {
        const cursor = admin.find({});
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
  res.send("travel agency");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
