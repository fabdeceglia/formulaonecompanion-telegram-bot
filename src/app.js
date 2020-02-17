require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const currentOS = require('os');
const request = require('request');
const endpoints = require('./endpoints');

const token = process.env.TOKEN;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
    polling: true
});


// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `
            Welcome at <b>Formula One Companion Bot</b>
      
            Available commands:
        
            /schedule <b>URL</b> - The season's schedule
        `, {
            parse_mode: 'HTML',
        }
    );
});

bot.onText(/\/schedule/, (msg) => {
    const chatId = msg.chat.id;
    request.get(endpoints.seasonSchedule, (error, response, body) => {
        bot.sendMessage(
            chatId,
            `
            ${currentOS.EOL}<b>1. Australian Gran Prix </b> - Melborune, Australia - 17th March 2019
            ${currentOS.EOL}<b>2. Bahrain Grand Prix </b> - Sakhir, Bahrain - 31th March 2019
            `, {
                parse_mode: 'HTML',
            }
        );
    })

});
