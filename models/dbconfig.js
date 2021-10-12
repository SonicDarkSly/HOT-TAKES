const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:test@cluster0.dzq65.mongodb.net/database?retryWrites=true&w=majority";
const client = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(
  uri,
  client,
  (err) => { 
    if (!err) console.log('mongodb connected success') 
    else console.log ('mongodb error : '+ err)
  }
);