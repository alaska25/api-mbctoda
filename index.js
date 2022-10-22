// Require Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");


// Create server
const app = express();
const port = 8080;

// connect to our MongoDb Database
mongoose.connect("mongodb+srv://admin:admin@cluster0.scuimpl.mongodb.net/mbctoda_v1?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error"));
db.once("open", () => console.log("We're connected to the database."));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/users", userRoutes);

//Listening to Port
app.listen(process.env.PORT || port, ()=>{
	console.log(`API is now online on port ${process.env.PORT || port}`);
})