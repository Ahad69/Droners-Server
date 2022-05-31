const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.zgsbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();

      const database = client.db("Assignment12");
      const products = database.collection("productsCollection");
      const reviews = database.collection("reviewCollection");
      const purchase = database.collection("purchaseCollection");
      const users = database.collection("usersCollection")

      //-------------------------------------------------------- products 
     app.get('/products' , async(req, res)=>{
         const cursor = await products.find({}).toArray()
         res.send(cursor)
     })
     app.post('/products', async(req , res )=>{
       
      const cursor =  products.insertOne(req.body)
      const result = await cursor.toArray()
      res.send(result)
    })


    // ------------------------------------------------------ reviews 
     app.get('/reviews' , async(req, res)=>{
         const cursor = await reviews.find({}).toArray()
         res.send(cursor)
     })
     app.post('/reviews', async(req , res )=>{
       
      const cursor =  reviews.insertOne(req.body)
      const result = await cursor.toArray()
      res.send(result)
    })





    //------------------------------------------------------  Purchase  

     app.post('/addpurchase', async(req , res )=>{
       
        const cursor =  purchase.insertOne(req.body)
        const result = await cursor.toArray()
        res.send(result)
      })
      app.get("/addpurchase", async (req, res) => {
        const email = req.query.email;
        
        let search ;
        if(email){
          search= await purchase.find({email: email}).toArray();
          res.send(search)
        }
        search = await purchase.find().toArray();
          res.send(search)
      });
      // app.get('/addpurchase', async(req , res )=>{
      //   console.log(req.body)
      //   const email = req.query.email;
      //   console.log(email)
      //   if(query){
      //     const queryEmail = purchase.find(user => user.email.includes(query))
      //     console.log(queryEmail)
      //     res.send(queryEmail)
      //   }else{
      //     const result = await purchase.find().toArray()
      //     res.send(result)
      //   }
         
      // })


      app.delete('/products/:id' , async(req , res)=>{
        const id = req.params.id ;
        const query = {_id: ObjectId(id)};
        const result = await products.deleteOne(query)
        res.json(result)
    })
      app.delete('/addpurchase/:id' , async(req , res)=>{
        const id = req.params.id ;
        const query = {_id: ObjectId(id)};
        const result = await purchase.deleteOne(query)
        res.json(result)
    })





    //-------------------------------------------------------- admin 
    app.post('/users', async(req , res )=>{
       
      const cursor =  users.insertOne(req.body)
      const result = await cursor.toArray()
      res.send(result)
    })
   app.get('/users' , async(req, res)=>{
    const cursor = await users.find({}).toArray()
    res.send(cursor)
})
  app.put('/users' , async(req , res)=>{
      const user = req.body;
      const filter = {email : user.email};
      const options = {upsert:true};
      const updateDocs = {$set:user}
      const result = await users.updateOne(filter, updateDocs , options)
      res.json(result)
  })
  app.get('/users/:email' , async(req , res)=>{
    const email = req.params.email
    const query = {email : email};
    const user = await users.findOne(query)
    let isAdmin = false;
    if(user.role === 'admin'){
      isAdmin = true
    }
    res.json({admin : isAdmin})
  })

  app.put('/users/admin'  , async(req , res)=>{
    const user = req.body;
    const filter = {email : user.email};
    
    const updateDocs = {$set: {role : 'admin'}}
    const result = await users.updateOne(filter, updateDocs)
    res.json(result)
  })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("hi")
})
app.listen(port, ()=>{
    console.log('hey' , port)
})
