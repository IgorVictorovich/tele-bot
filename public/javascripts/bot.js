const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const session = require('telegraf/session');
const {reply} = Telegraf;
const BOT_TOKEN = '479147485:AAG8TKsZMEiZGDHNDNiqzzfuqzFsW8dhGtU';
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

const sayYoMiddleware = ({reply}, next) => reply('yo').then(() => next());

// Random location on some text messages
bot.on('text', ({replyWithLocation}, next) => {
    if (Math.random() > 0.2) {
        return next();
    }
    return Promise.all([replyWithLocation((Math.random() * 180) - 90, (Math.random() * 180) - 90), next()]);
});

// Text messages handling
bot.hears('Hey', sayYoMiddleware, (ctx) => {
    ctx.session.heyCounter = ctx.session.heyCounter || 0;
    ctx.session.heyCounter++;
    return ctx.replyWithMarkdown(`_Hey counter:_ ${ctx.session.heyCounter}`);
});

// Command handling
bot.command('answer', sayYoMiddleware, (ctx) => {
    console.log(ctx);
    console.log(ctx.message);
    return ctx.reply('*42*', Extra.markdown());
});

const catPhoto = 'http://lorempixel.com/400/200/cats/';
bot.command('cat', ({replyWithPhoto}) => replyWithPhoto(catPhoto));

// Streaming photo, in case Telegram doesn't accept direct URL
bot.command('cat2', ({replyWithPhoto}) => replyWithPhoto({url: catPhoto}));

// Look ma, reply middleware factory
bot.command('foo', reply('http://coub.com/view/9cjmt'));

// Wow! RegEx
bot.hears(/reverse (.+)/, ({match, reply}) => {
    return reply(match[1].split('').reverse().join(''));
});


bot.hears(/country (.+)/, ({match, reply}) => {
    const name = match[1].split('').join('');
    countries.getCountryInfo(name)
        .then((resp) => {
            if (Array.isArray(resp)) {
                const capital = resp[0].capital;
                const population = resp[0].population;
                const answer = `${name} capital is ${capital} with population ${population}`;
                return reply(answer);
            }
            return reply('Not found!');
        }).catch((err) => {
            return reply('Try again later');
            console.error(`error during calling ${targetUrl}:\n${err}`);
        });
});

exports.createBot = bot;
