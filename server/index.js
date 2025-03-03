require("dotenv").config();
require('express-async-errors');
const cors = require("cors");
const express = require('express');
const setupBot = require("./bot");
const redditRoutes = require("./routes/reddit");

const app = express();

const bot = setupBot();
bot.launch();
console.log("Bot is launched...");

// apply global settings
app.use(cors()); // for frontend-backend origin differences
app.use(express.json());

app.use("/api/reddit", redditRoutes);

// Webhook route
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Webhook URL: https://${process.env.RAILWAY_URL}/bot${process.env.BOT_TOKEN}`);
});