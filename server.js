/**
 * This example demonstrates setting up a webook, and receiving
 * updates in your express app
 */
/* eslint-disable no-console */

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8081;
const answerUsername = process.env.USERNAME = '@kekassssss';

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  console.log(`Receiving updates ${JSON.stringify(req.body)}`);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${url} ${port}`);
});

// Just to ping!
bot.on('message', msg => {
  const { message_id: originalMessageId, from: { username }, chat: { id: chatId, title} } = msg;

  console.log(`Receiving message from ${username} in chat ${title}`);

  if (username !== answerUsername) {
    return;
  }

  bot.sendMessage(chatId, `Пішов нахуй ${username}`, {
    reply_to_message_id: originalMessageId
  });
});
