// Telegram Bot API
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('6590710056:AAHVIa6YcPBr4F-QgeNKmbesetvPtcmtcO8'); 

// Inshorts API endpoint
const API_URL = 'https://inshorts.deta.dev/news?category={category_name}';

// /news command handler
bot.onText(/\/news (\w+)/, async (msg, match) => {

  const category = match[1];

  if(!category.match(/^\w+$/)) {
    return bot.sendMessage(msg.chat.id, 'Invalid category name');
  }

  const url = API_URL.replace('{category_name}', category);

  try {

    const res = await fetch(url);
    const data = await res.json();

    if(!data.success) {
      throw new Error('API error');
    }

    if(data.data.length > 0) {

      data.data.forEach(article => {

        let message = `<b>${article.title}</b>\n`;
        message += `${article.content}\n\n`;
        message += article.readMoreUrl;

        bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'});
      });

    } else {
      bot.sendMessage(msg.chat.id, 'No news found for that category');
    }

  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Error getting news');  
  }

});

// Set webhook to GitHub pages
bot.setWebHook('https://<username>.github.io/<repo>/bot.js');
