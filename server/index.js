require("dotenv").config();
require('express-async-errors');
const cors = require("cors");
const express = require('express');
const teleBot = require("./bot");
const redditRoutes = require("./routes/reddit");

const app = express();

teleBot();

// apply global settings
app.use(cors()); // for frontend-backend origin differences
app.use(express.json());

app.use("/api/reddit", redditRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});