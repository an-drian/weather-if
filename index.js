const Telegraf = require('telegraf');
const cron = require('node-cron');
const moment = require('moment');

const { saveUser, User } = require('./db');
const { getWeather, getCurrentWeather } = require('./weather'); 
const { 
  getFormattedDate,
  getFormattedTime,
  calcPercent,
  getMoonEmoji,
  formatWeatherString,
  formatCurrentWeather,
} = require('./helpers');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Привіт! Я погодній бот Івано-Фанківська - weather IF 🖐! Відправте годину, о котрій ви б хотіли отримувати повідомлення про погоду в форматі (HH:MM).Приклад: "10:15". Для того, щоб отримати більше інформації, напишіть "/help".')
  .catch((error) => {
    console.log(error, 'promise catch error');
  });
});

bot.catch((error) => {
  console.log(error, 'catch error');
});

var task = cron.schedule('* * * * *', function() {
  const date = moment();
  console.log(date.format('H:mm'));
  User.find({ time: date.format('H:mm') }, (error, users) => {
    if (error) throw error;
    if (users.length > 0) {
      getWeather((result) => {
        users.forEach((user) => {
          bot.telegram.sendMessage(user.telegramUserId, formatWeatherString(result.daily.data[0]))
            .catch(error => console.log('Error'));
        })  
      });
    }
  });
});

bot.command('help', (ctx) => ctx.reply(
  '"/start" - для початку роботи' +
  '"/stop" - зупинити сповіщення;\n' +
  '"HH:MM" - час, коли ви хочете отримувати щоденні сповіщення;\n' +
  '"/current" - отримати інформацію про погоду на даний момент;'
));

bot.command('stop', (ctx) => {
  console.log('Stopped: ', ctx.chat.id);
  User.findOneAndRemove({ telegramUserId: ctx.chat.id }, (error, result) => {
    if (error) throw new Error(error);
    console.log(result);
    ctx.reply('Сповіщення зупинено 😱');
  });
});

bot.hears('Привіт', (ctx) => ctx.reply('Привіт!'));

bot.hears('test', (ctx) => {
  // bot.telegram.sendMessage(231630635, 'Ввесь мир тебя кружит!')
});

bot.hears('/current', (ctx) => {
  getCurrentWeather((result) => {
    bot.telegram.sendMessage(ctx.chat.id, formatCurrentWeather(result.currently))
      .catch(error => console.log('Error'));
  });
});

bot.hears(/(хуй|пизд|блят|бляд|сука|пізд|єба|їба|йоб|хує)/, (ctx) => {
  ctx.reply('І ти тим ротом маму цілуєш? 😒');
})


bot.hears(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, (ctx) => {
  const { first_name, id, last_name } = ctx.message.chat;
  User.findOne({ telegramUserId: id }, (error, userDoc) => {
    if(error) throw new Error(error); 
    if(userDoc) {
      userDoc.set({ time: ctx.message.text });
      userDoc.save((error, updatedUser) => {
        if(error) throw new Error(error);
        return ctx.reply(`⏰ Ви змінили час сповіщень про погоду. Тепер сповіщення будуть приходити в ${updatedUser.time}`);
      });
    } else {
      User.saveUser({
        firstName: first_name,
        lastName: last_name,
        telegramUserId: id,
        time: ctx.message.text,
      });
      ctx.reply(`⏰ Сповіщення про погоду вам будуть приходити щодня о ${ctx.message.text}.\nЩоб припинити відправлення сповіщень наберіть команту "/stop"`);
    }
  })
});

bot.startPolling();