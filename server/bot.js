const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { createReadStream } = require('fs');
const generateCsv = require('./utils/csvMaker');
const generatePdf = require('./utils/pdfMaker');
const { extractImageType } = require('./utils/dataParser');

const setupBot = () => {
    const bot = new Telegraf(process.env.BOT_TOKEN);

    const reportOptions = Markup.inlineKeyboard([
        Markup.button.callback("PDF", "pdf"),
        Markup.button.callback("CSV", "csv")
    ]);

    bot.command('start', async (ctx) => {
        const chatId = ctx.chat.id;

        bot.telegram.sendMessage(chatId, 'Welcome to this space where we provide you with the hottest reddit memes now! 🔥\n' 
                                       + 'Type /topmemes so i can crawl Reddit for you');

        const response = await fetch('http://localhost:8080/api/reddit/rising-memes');
        const data = await response.json();

        for (const post of data.redditPosts.redditPosts) {
            const imageType = extractImageType(post.url);
            if (imageType == "gif" || imageType == "") {
                continue;
            }
            
            await bot.telegram.sendMessage(chatId, 'As a gift, let me show you a rising meme in Reddit now:');
            await bot.telegram.sendPhoto(chatId, post.url);

            break;
        }
    });

    bot.command('topmemes', (ctx) => {
        bot.telegram.sendMessage(ctx.chat.id, 'Which format do you wish to view the results in?', reportOptions);
    });

    bot.action("pdf", async (ctx) => {
        try {
            const chatId = ctx.chat.id;
            const response = await fetch('http://localhost:8080/api/reddit/top-memes');
            const data = await response.json();

            bot.telegram.sendMessage(chatId, `Ok! Please wait while we generate your pdf report...`);

            const pdfBuffer = await generatePdf(data.redditPosts);

            await bot.telegram.sendDocument(ctx.chat.id, {
                source: pdfBuffer,
                filename: 'Reddit Top Memes Report.pdf'
            });
            await bot.telegram.sendMessage(chatId, 'Here is your PDF report of Reddit\'s top 20 most upvoted memes '
                                                 + 'in the past 24 hours, sorted in DESC order. Enjoy!');
        } catch (err) {
            console.error("Error generating pdf report", err);
        }
    });

    bot.action("csv", async (ctx) => {
        try {
            const chatId = ctx.chat.id;
            const response = await fetch('http://localhost:8080/api/reddit/top-memes');
            const data = await response.json();
    
            const filePath = generateCsv(data.redditPosts);
            await bot.telegram.sendDocument(chatId, {
                source: createReadStream(filePath),
                filename: 'Reddit Top Memes Report.csv'
            });
            await bot.telegram.sendMessage(chatId, 'Here is your CSV report of Reddit\'s top 20 most upvoted memes '
                                                 + 'in the past 24 hours, sorted in DESC order. Enjoy!');
        } catch (err) {
            console.error("Error generating csv report", err);
        }
    });

    bot.on(message, (ctx) => {
        const chatId = ctx.chat.id;
        const messageText = ctx.text;

        if (messageText !== '/start' && messageText !== '/topmemes') {
            bot.telegram.sendMessage(chatId, "I don't quite get what you're saying... \nType /topmemes so i can crawl Reddit for you!");
        }
    });

    return bot;
}

module.exports = setupBot;