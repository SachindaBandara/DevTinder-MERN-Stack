const express = require("express");
const dbConnection = require("./config/dbConnection");

const app = express();

dbConnection()
    .then(()=>{
        console.log("Connected Database Successfully");
        // PORT checking 
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err)=> {
        console.log("Error in connecting database", err);
    })


