require("dotenv").config();
require('express-async-errors');
const cors = require("cors");
const connection = require("./db");
const express = require('express');

const app = express();

connection();

// apply global settings
app.use(cors()); // for frontend-backend origin differences
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});