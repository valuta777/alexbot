const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8081;
const answerUsername = process.env.USERNAME || '@kekassssss';

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

const app = express();

// This informs the Telegram servers of the new webhook.
const setupWebhook = async () => {
  console.log('webhook setup ...');
  try {
    const result = await bot.setWebHook(`${url}/bot${TOKEN}`);
    console.log('webhook setup done', result);
  } catch (error) {
    console.error(error);
    return error
  }
}

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  console.log('Receiving updates', req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, async () => {
  try {
    await setupWebhook();
  } catch (error) {
    console.log(error);
  }
  console.log(`Express server is listening on ${url} ${port}`);
});

// Just to ping!
bot.on('message', async (msg) => {
  const { message_id: originalMessageId, from: { username }, chat: { id: chatId} } = msg;

  console.log(`Receiving message`, msg);

  if (username !== answerUsername) {
    console.log(`Message not from ${answerUsername}`);
    return;
  }

  console.log(`Sending message to ${username}`, msg);

  try {
    const result = await bot.sendMessage(chatId, `Пішов нахуй ${username}`, {
      reply_to_message_id: originalMessageId
    })
    console.log('Send message', result);
  } catch (error) {
    console.log(error);
  };
});
