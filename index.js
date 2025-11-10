const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://freelanceMarketPlace:Bf5v1qF8OOHth0uR@cluster0.3lozw5z.mongodb.net/?appName=Cluster0";



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
    res.send('freelance server is runnig')
})

async function run (){
    try{
        await client.connect();
      await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`freelance server is running on port: ${port}`)
})



