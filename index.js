const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.3lozw5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully!");

    const db = client.db("freelanceDB");
    const jobsCollection = db.collection("jobs");
    const acceptedJobsCollection = db.collection("acceptedJobs");
    const usersCollection = db.collection("users");

    app.get("/", (req, res) => res.send("🚀 Freelance server running"));
    app.post("/addJob", async (req, res) => {
      try {
        const job = { ...req.body, createdAt: new Date() };
        const result = await jobsCollection.insertOne(job);
        res.json({ message: "Job added", id: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Failed to add job" });
      }
    });
    app.get("/allJobs", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 0;
        const sortOrder = req.query.sort === "asc" ? 1 : -1;
        const jobs = await jobsCollection
          .find()
          .sort({ createdAt: sortOrder })
          .limit(limit)
          .toArray();
        res.json(jobs);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
      }
    });
    app.get("/allJobs/:id", async (req, res) => {
      try {
        const job = await jobsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json(job);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch job" });
      }
    });

  app.get("/myAddedJobs", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "User email is required" });

  const jobs = await jobsCollection.find({ userEmail: email }).toArray();
  res.status(200).json(jobs);
});
    app.put("/updateJob/:id", async (req, res) => {
      try {
        const { title, category, summary, coverImage } = req.body;
        const updatedJob = {
          $set: { title, category, summary, coverImage, updatedAt: new Date() },
        };
        const result = await jobsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          updatedJob
        );
        if (result.matchedCount === 0)
          return res.status(404).json({ message: "Job not found" });
        const job = await jobsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.json(job);
      } catch (error) {
        res.status(500).json({ message: "Failed to update job" });
      }
    });

    app.delete("/deleteJob/:id", async (req, res) => {
      try {
        const result = await jobsCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Job not found" });
        res.json({ message: "Job deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
      }
    });

    app.post("/myAccepted-task", async (req, res) => {
      try {
        const acceptedJob = { ...req.body, acceptedAt: new Date() };
        const result = await acceptedJobsCollection.insertOne(acceptedJob);
        res.json({ message: "Job accepted", id: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Failed to accept job" });
      }
    });

    app.get("/accepted", async (req, res) => {
      try {
        const jobs = await acceptedJobsCollection.find().toArray();
        res.json(jobs);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch accepted jobs" });
      }
    });
    app.post("/users", async (req, res) => {
      try {
        const user = { ...req.body, createdAt: new Date() };
        const result = await usersCollection.insertOne(user);
        res.json({ message: "User registered", id: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Failed to register user" });
      }
    });

    app.listen(port, () =>
      console.log(`Server running on port ${port}`)
    );
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

run();
