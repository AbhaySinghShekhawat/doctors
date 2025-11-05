
let mongoose = require('mongoose');
let dotenv = require('dotenv');

dotenv.config();





const connectDB = async () => {
 try {
 const connect = await mongoose.connect(process.env.MONGO_URL,{
dbName:"doctor",
 });
console.log(`MongoDB Connected: ${connect.connection.host}`);
} catch (error) {
 console.log(error);
}
};
module.exports = connectDB;