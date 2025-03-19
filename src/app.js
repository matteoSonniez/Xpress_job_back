const express = require('express')
const app = express();
const mongoose = require('mongoose');
var cors = require('cors')
const apiRouter = require('./routes');
require('dotenv').config();

//mongoDb connect
mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority` 
).then(() => {
  console.log("successfully connect to database")
}).catch(err=>console.log(err))

//Middlewares & routes
app.use(cors());
app.use(express.json());
app.use("/api/", apiRouter)

// start app
app.listen(process.env.PORT, function () {
  console.log("Server launch");
}); 