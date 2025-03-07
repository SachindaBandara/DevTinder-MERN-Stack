const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//     res.send("Hello World! 205");
// });


app.listen(5500, () => {
    console.log("Server is running on port 5500");
});