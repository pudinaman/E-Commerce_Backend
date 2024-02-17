const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
   // useCreateIndex: true,
   // useFindAndModify: false,
  })
  .then((data) => {
    console.log(`Mongoose connected with server: ${data.connection.host}`);
  })
};

module.exports = connectDatabase;
