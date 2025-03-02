const TelegramBot = require('node-telegram-bot-api');
const generateCsv = require('./utils/csvMaker');
const generatePdf = require('./utils/pdfMaker');
const { extractImageType } = require('./utils/dataParser');

const teleBot = () => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (messageText === '/start') {
            bot.sendMessage(chatId, 'Welcome to this space where we provide you with the hottest reddit memes now! \u1F972');

            const response = await fetch('http://localhost:8080/api/reddit/rising-memes');
            const data = await response.json();

            for (const post of data.redditPosts) {
                const imageType = extractImageType(post.url);
                if (imageType == "gif" || imageType == "") {
                    continue;
                }
                
                const response = await fetch(post.url)
                const imageBuffer = await response.arrayBuffer();
                bot.sendMessage(chatId, 'As a gift for you, let me show you a rising meme in Reddit now:');
                bot.sendPhoto(chatId, imageBuffer);
                break;
            }
        } else if (messageText === '/topmemes') {
            const response = await fetch('http://localhost:8080/api/reddit/top-memes');
            const data = await response.json();
            
            const pdfBuffer = await generatePdf(data.redditPosts);
            bot.sendDocument(chatId, pdfBuffer, {
                caption: 'Reddit Top 20 Memes Now',
                filename: 'redditmeme_report.pdf'
            });
            bot.sendMessage(chatId, 'Here is your report of Reddit\'s top 20 most upvoted memes in the past 24 hours, sorted in DESC order. Enjoy!');
        } else if (messageText === '/topmemescsv') {
            const response = await fetch('http://localhost:8080/api/reddit/top-memes');
            const data = await response.json();
            
            //console.log("postss", data.redditPosts);
            const filePath = generateCsv(data.redditPosts);
            //console.log(csvBuffer instanceof Buffer);
            bot.sendDocument(chatId, filePath, {
                filename: 'redditmeme_report.csv'
            });
        } else {
            bot.sendMessage(chatId, "I don't quite get what you're saying... \nType /topmemes so i can crawl Reddit for you!");
        }
    });

    console.log("Bot is running...");
}

module.exports = teleBot;