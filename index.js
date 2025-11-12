const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://shakhawat:ViDw279qU50wqkdE@cluster0.3lozw5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    console.log("✅ MongoDB Connected Successfully!");

    const db = client.db("freelanceDB");
    const jobsCollection = db.collection("jobs");
    const acceptedJobsCollection = db.collection("acceptedJobs");
    const usersCollection = db.collection("users");

    // 🌐 Root
    app.get("/", (req, res) => {
      res.send("🚀 Freelance server is running");
    });

    // 🟢 POST: Add new job
    app.post("/job", async (req, res) => {
      try {
        const job = {
          ...req.body,
          createdAt: new Date(),
        };
        const result = await jobsCollection.insertOne(job);
        res.status(201).json({ message: "✅ Job added", id: result.insertedId });
      } catch (error) {
        console.error("❌ Error adding job:", error);
        res.status(500).json({ message: "Failed to add job" });
      }
    });

    // 🔵 GET: All jobs (optional limit)
    app.get("/job", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 0;
        const jobs = await jobsCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
        res.status(200).json(jobs);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
      }
    });

    // 🟣 GET: Single job by ID
    app.get("/job/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(job);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch job" });
      }
    });

    // 🟩 POST: Accept a job (store with user info)
    app.post("/accepted", async (req, res) => {
      try {
        const acceptedJob = {
          ...req.body,
          acceptedAt: new Date(),
        };
        const result = await acceptedJobsCollection.insertOne(acceptedJob);
        res.status(201).json({
          message: "✅ Job accepted and stored!",
          id: result.insertedId,
        });
      } catch (error) {
        console.error("❌ Error storing accepted job:", error);
        res.status(500).json({ message: "Failed to store accepted job" });
      }
    });

    // 🧹 GET: All accepted jobs
    app.get("/accepted", async (req, res) => {
      const jobs = await acceptedJobsCollection.find().toArray();
      res.json(jobs);
    });

    // 🗑 DELETE: Remove accepted job by ID
    app.delete("/accepted/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await acceptedJobsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.status(200).json({ message: "Job removed", result });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
      }
    });

    // 🟢 POST: Register a new user
    app.post("/users", async (req, res) => {
      try {
        const user = {
          ...req.body,
          createdAt: new Date(), // store registration date & time
        };
        const result = await usersCollection.insertOne(user);
        res.status(201).json({
          message: "✅ User registered successfully!",
          id: result.insertedId,
        });
      } catch (error) {
        console.error("❌ Error adding user:", error);
        res.status(500).json({ message: "Failed to register user" });
      }
    });

    // 🚀 Start server
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

run();
