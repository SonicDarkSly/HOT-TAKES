const mongoose = require('mongoose');

const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_CLUSTER+".dzq65.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority";
const client = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(
  uri,
  client,
  (err) => { 
    if (!err) console.log('MongoDB connected success') 
    else console.log ('MongoDB error : '+ err)
  }
);