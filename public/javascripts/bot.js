const Telegraf = require('telegraf');
const session = require('telegraf/session');
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);
const countries = require('./api/countries.service');

bot.use(session());

// Register logger middleware
bot.use((ctx, next) => {
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log('response time %sms', ms)
    });
});

bot.hears(/reverse (.+)/, ({match, reply}) => {
    return reply(match[1].split('').reverse().join(''));
});

bot.hears(/country (.+)/, ({match, reply}) => {
    const name = match[1].split('').join('');
    countries.getCountryInfo(name)
        .then((resp) => {
            if (resp.hasOwnProperty('status')) {
                return reply(resp.message);
            }
            if (Array.isArray(resp)) {
                const capital = resp[0].capital;
                const population = resp[0].population;
                const answer = `${name} capital is ${capital} with population ${population}`;
                return reply(answer);
            }
            return reply('Not found!');
        }).catch((err) => {
            console.error(`error during calling getCountryInfo:\n${err}`);
            console.log(JSON.stringify(err));
            return reply('Try again later');
        });
});

bot.command('commands', (ctx) => {
    ctx.reply('Actual commands:\n /commands -return all commands\n' +
        '/country -return brief country info\n' +
        '/reverse -reverse text');
});

exports.createBot = bot;
