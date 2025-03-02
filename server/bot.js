const TelegramBot = require('node-telegram-bot-api');
const generateCsv = require('./utils/csvMaker');
const generatePdf = require('./utils/pdfMaker');
const { extractImageType } = require('./utils/dataParser');

const launchBot = () => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    const reportOptions = {
        reply_markup: {
            inline_keyboard: [
                [{
                    "text": "Generate PDF",
                    "callback_data": "pdf"
                }],
                [{
                    "text": "Generate CSV",
                    "callback_data": "csv"
                }]
            ]
        }
    }

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, 'Welcome to this space where we provide you with the hottest reddit memes now! 🔥');

        const response = await fetch('http://localhost:8080/api/reddit/rising-memes');
        const data = await response.json();

        for (const post of data.redditPosts.redditPosts) {
            const imageType = extractImageType(post.url);
            console.log("image type", imageType);
            if (imageType == "gif" || imageType == "") {
                continue;
            }
            
            await bot.sendMessage(chatId, 'As a gift, let me show you a rising meme in Reddit now:');
            bot.sendPhoto(chatId, post.url);
            break;
        }
    });

    bot.onText(/\/topmemes/, (msg) => {
        const chatId = msg.chat.id;
        
        bot.sendMessage(chatId, 'Which format do you wish to view the results in?', reportOptions);
    });

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const queryData = query.data;

        const response = await fetch('http://localhost:8080/api/reddit/top-memes');
        const data = await response.json();
        
        if (queryData === 'pdf') {
            bot.sendMessage(chatId, `Ok! Please wait while we generate your pdf report...`);

            const pdfBuffer = await generatePdf(data.redditPosts);
            bot.sendDocument(chatId, pdfBuffer, {}, {
                filename: 'Reddit Top Memes Report.pdf',
                contentType: 'application/pdf'
            }).then(() => {
                bot.sendMessage(chatId, 'Here is your PDF report of Reddit\'s top 20 most upvoted memes in the past 24 hours, sorted in DESC order. Enjoy!');
            });
        } else if (queryData === 'csv') {
            const filePath = generateCsv(data.redditPosts);
            bot.sendDocument(chatId, filePath, {}, {
                filename: 'Reddit Top Memes Report.csv',
                contentType: 'application/csv'
            }).then(() => {
                bot.sendMessage(chatId, 'Here is your CSV report of Reddit\'s top 20 most upvoted memes in the past 24 hours, sorted in DESC order. Enjoy!');
            });
        }
    })

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (messageText !== '/start' && messageText !== '/topmemes') {
            bot.sendMessage(chatId, "I don't quite get what you're saying... \nType /topmemes so i can crawl Reddit for you!");
        }
    });

    console.log("Bot is running...");
}

module.exports = launchBot;