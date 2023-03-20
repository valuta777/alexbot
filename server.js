const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8081;
const usersToShutUp = process.env.USER_IDS || '';
const sticker = process.env.STICKER; 

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

const app = express();

// This informs the Telegram servers of the new webhook.
const setupWebhook = async () => {
  console.log('webhook setup ...');
  try {
    const result = await bot.setWebHook(`${url}/bot${TOKEN}`);
    console.log('webhook setup done', JSON.stringify(result));
  } catch (error) {
    console.error(error);
    return error
  }
}

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, async () => {
  try {
    await setupWebhook();
  } catch (error) {
    console.error(error);
  }
  console.log(`Express server is listening on ${url} ${port}`);
});

// Just to ping!
bot.on('message', async (msg) => {
  const { message_id: originalMessageId, from: { username, id }, chat: { id: chatId} } = msg;

  console.log(`Receiving message`, JSON.stringify(msg));

  if (!usersToShutUp.includes(id.toString())) {
    console.log(`Message not from ${usersToShutUp}`);
    return;
  }

  console.log(`Sending message to ${username}`);

  try {
    const result = await bot.sendMessage(chatId, `Пішов нахуй @${username}`, {
      reply_to_message_id: originalMessageId
    })
    console.log('Send message', result);
  } catch (error) {
    console.error(error);
  };

  if(stiker) {
    try {
      const result = await bot.sendSticker(chatId, sticker)
      console.log('Send sticker', result);
    } catch (error) {
      console.error(error);
    };
  }
});
