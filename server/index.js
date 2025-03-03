require("dotenv").config();
require('express-async-errors');
const express = require('express');
const setupBot = require("./bot");
const redditRoutes = require("./routes/reddit");

const app = express();

const bot = setupBot();
bot.launch();
console.log("Bot is launched...");

app.use(express.json());

app.use("/api/reddit", redditRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (res) => {
    res.send(`Hello, visit http://localhost:${PORT}/api/reddit/top-memes to crawl r/memes`);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});