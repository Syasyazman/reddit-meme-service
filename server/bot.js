const TelegramBot = require('node-telegram-bot-api');
const generatePdf = require('./utils/pdfMaker');

const teleBot = () => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (messageText === '/start') {
            bot.sendMessage(chatId, 'Welcome to this space where we provide you with the hottest reddit memes now! \u1F972');
        } else if (messageText === '/topmemes') {
            const response = await fetch('http://localhost:8080/api/reddit/top-memes');
            const data = await response.json();
            
            const pdfBuffer = await generatePdf(data.redditPosts);
            bot.sendDocument(chatId, pdfBuffer, {
                caption: 'Here is your generated PDF!',
                filename: 'report.pdf'
            });

            console.log('PDF sent successfully');
        } else {
            bot.sendMessage(chatId, "I don't quite get what you're saying... Type /commands to see what I can do for you!");
        }
    });

    console.log("Bot is running...");
}

module.exports = teleBot;