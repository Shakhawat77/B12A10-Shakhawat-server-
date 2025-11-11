//     const express = require("express");
//     const cors = require("cors");
//     const { MongoClient, ServerApiVersion } = require("mongodb");
//     const app = express();
//     const port = process.env.PORT || 3000;

//     app.use(cors());
//     app.use(express.json());


//     const uri =
//     "mongodb+srv://shakhawat:ViDw279qU50wqkdE@cluster0.3lozw5z.mongodb.net/?appName=Cluster0";
//     const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
//     });

//     const db = client.db("freelanceDB");
//     const jobsCollection = db.collection("jobs");

//     app.get("/", (req, res) => {
//     res.send("freelance server is runnig");
//     });

//     app.post("/job", async (req, res) => {
//     const jobData = req.body;
//     console.log(jobData);

//     // Validate required fields
//     //   const requiredFields = [
//     //     "title",
//     //     "postedBy",
//     //     "category",
//     //     "summary",
//     //     "coverImage",
//     //     "userEmail",
//     //   ];
//     // for (const field of requiredFields) {
//     //   if (!jobData[field]) {
//     //     return res.status(400).json({ message: `${field} is required.` });
//     //   }
//     // }

//     const result = await jobsCollection.insertOne(jobData);

//     res.status(201).json({
//         message: "Job added successfully!",
//         insertedId: result.insertedId,
//     });
//     });

//     async function run() {
//     try {
//         // await client.connect();
//         await client.db("admin").command();
//         console.log(
//         "Pinged your deployment. You successfully connected to MongoDB!"
//         );
//     } finally {
//     }
//     }
//     run().catch(console.dir);

//     app.listen(port, () => {
//     console.log(`freelance server is running on port: ${port}`);
//     });
// // const express = require("express");
// // const cors = require("cors");
// // const { MongoClient, ServerApiVersion } = require("mongodb");

// // const app = express();
// // const port = process.env.PORT || 3000;

// // app.use(cors());
// // app.use(express.json());

// // const uri ="mongodb+srv://shakhawat:ViDw279qU50wqkdE@cluster0.3lozw5z.mongodb.net/?appName=Cluster0";

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // async function run() {
// //   try {
// //     // CONNECT TO MONGODB
// //     await client.connect();
// //     console.log("MongoDB connected successfully!");

// //     const db = client.db("freelanceDB");
// //     const jobsCollection = db.collection("jobs");

// //     // ROOT ROUTE
// //     app.get("/", (req, res) => {
// //       res.send("freelance server is running");
// //     });

// //     // POST JOB API
// //     app.post("/job", async (req, res) => {
// //       try {
// //         const jobData = req.body;
// //         const result = await jobsCollection.insertOne(jobData);

// //         res.status(201).json({
// //           message: "Job added successfully!",
// //           insertedId: result.insertedId,
// //         });
// //       } catch (error) {
// //         res.status(500).json({ error: error.message });
// //       }
// //     });

// //     // START SERVER AFTER DB CONNECTS
// //     app.listen(port, () => {
// //       console.log(`Server running on port ${port}`);
// //     });

// //   } catch (err) {
// //     console.error("DB Connection Error:", err);
// //   }
// // }

// // run().catch(console.dir);
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

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
    // CONNECT TO MONGODB ATLAS
    await client.connect();
    console.log("MongoDB Connected Successfully!");

    // DATABASE + COLLECTION
    const db = client.db("freelanceDB");
    const jobsCollection = db.collection("jobs");

    // -----------------------
    // ROUTES
    // -----------------------

    app.get("/", (req, res) => {
      res.send("Freelance server is running");
    });

    app.post("/job", async (req, res) => {
      const result = await jobsCollection.insertOne(req.body);
      res.status(201).json({
        message: "Job added successfully!",
        insertedId: result.insertedId,
      });
    });

    // START SERVER **AFTER** DB CONNECTS
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

run();
