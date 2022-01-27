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
    const database = client.db("travel");
    const allBlog = database.collection("blog");

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
