require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const currentOS = require('os');
const request = require('request');
const endpoints = require('./endpoints');
const lodash = require('lodash/fp');
const moment = require('moment');

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
        
            /raceList <b>URL</b> - The season's race list
            /driverStandings <b>URL</b> - The driver's standings
            /constructorStandings <b>URL</b> - The constructor's standings
        `, {
            parse_mode: 'HTML',
        }
    );
});

bot.onText(/\/driverStandings/, (msg) => {
    const chatId = msg.chat.id;
    
    request.get(endpoints.driverStandings, (error, response, body) => {
        const driverStandings = JSON.parse(body);

        const mappedDriverStandings = lodash.map((driverStanding) => {
            return {
                position: driverStanding.position,
                driver: `${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`,
                points: driverStanding.points
            }
        })(driverStandings);

        let driverStandingsMsg = ``;

        lodash.forEach((mappedDriverStanding) => {
            driverStandingsMsg += `${currentOS.EOL}${mappedDriverStanding.position}. <b>${mappedDriverStanding.driver}</b> - ${mappedDriverStanding.points} pts.`
        })(mappedDriverStandings);

        bot.sendMessage(
            chatId,
            driverStandingsMsg, 
            {
                parse_mode: 'HTML',
            }
        );

    })


});

bot.onText(/\/constructorStandings/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `Feature WIP`, 
        {
            parse_mode: 'HTML',
        }
    );
});


bot.onText(/\/raceList/, (msg) => {
    const chatId = msg.chat.id;
    request.get(endpoints.seasonSchedule, (error, response, body) => {

        const races = JSON.parse(body);

        const mappedRaces = lodash.map((race) => {
            return {
                round: race.round,
                name: race.raceName,
                locality: race.Circuit.Location.locality,
                date: moment(race.date).format('MMM D YYYY')
            }
        })(races);
        
        let racesMsg = ``

        lodash.forEach((mappedRace) => {
            racesMsg += `${currentOS.EOL}<b>${mappedRace.round}. ${mappedRace.name} </b> - ${mappedRace.locality} - <i>${mappedRace.date}</i>`
        })(mappedRaces);

        bot.sendMessage(
            chatId,
            racesMsg, 
            {
                parse_mode: 'HTML',
            }
        );
    })
});
