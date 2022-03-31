import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
// console.log(URI);
const options: Object = {
  // useCreateIndex: true,
  // useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(`${URI}`, options, (err) => {
  if (err) throw err;
  console.log("MongoDb connection ");
});
