const moment = require('moment');

const getFormattedDate = (seconds) =>
  moment(0).seconds(seconds).format('DD.MM.YYYY');

const getFormattedTime = (seconds) =>
  moment(0).seconds(seconds).format('H:mm');

const calcPercent = (value, total, decimal, sign) => {
  const badNumbers = [NaN, Infinity, -Infinity];
  // Avoid argument type problems
  if (typeof value !== 'number' ||
    typeof total !== 'number' ||
    typeof decimal !== 'number') {
    return null;
  }
  // Don't divide by zero
  if (total === 0) {
    return 0;
  }
  // Avoid wrong numbers
  badNumbers.forEach((number) => {
    if ([value, total, decimal].indexOf(number) > -1) {
      return number;
    }
  });
  // Define the sign
  if (typeof sign !== 'string') {
    sign = sign ? '%' : '';
  }
  return (value / total * 100).toFixed(decimal) + sign;
};


const getMoonEmoji = (moonValue) => {
  const rounded = +moonValue.toFixed(1);
  switch (rounded) {
    case 0:
      return '🌑';
      break;
    case 0.1:
      return '🌒';
      break;
    case 0.2:
      return '🌒';
      break;
    case 0.3:
      return '🌓';
      break;
    case 0.4:
      return '🌔';
      break;
    case 0.5:
      return '🌕';
      break;
    case 0.6:
      return '🌖';
      break;
    case 0.7:
      return '🌖';
      break;
    case 0.8:
      return '🌗';
      break;
    case 0.9:
      return '🌘';
      break;
    case 1:
      return '🌘';
      break;
    default:
      break;
  }
}

const formatWeatherString = (today) =>
  `Погода на сьогодні (${getFormattedDate(today.time)}):
  ${today.summary},
  🌡 температура коливатиметься від ${today.temperatureHigh.toFixed(0)} до ${today.temperatureLow.toFixed(0)} °C,
  💨 швидкість вітру: ${today.windSpeed} м/с,
  відносна вологість повітря: ${calcPercent(today.humidity, 1, 0)}%,
  найвищої позначки стовпчик термометра досягне в ${getFormattedTime(today.apparentTemperatureHighTime)},
  а найнижчою температура буде в ${getFormattedTime(today.apparentTemperatureLowTime)}.
  ${getMoonEmoji(today.moonPhase)}
  Хай проблеми та незгоди не роблять вам в житті погоди. © Микола 😎`


const formatCurrentWeather = (current) => 
  `Погода станом на ${getFormattedTime(current.time)}:
  ${current.summary},
  🌡 температура: ${current.temperature} °C,
  💨 швидкість вітру: ${current.windSpeed} м/с,
  💦 відносна вологість повітря: ${calcPercent(current.humidity, 1, 0)}%,
  👀 видимість: ${current.visibility} км.`


module.exports = {
  getFormattedDate,
  getFormattedTime,
  calcPercent,
  getMoonEmoji,
  formatWeatherString,
  formatCurrentWeather,
}