const DarkSky = require('dark-sky');
require('dotenv').config();

const darksky = new DarkSky(process.env.DARK_SKY_KEY);

const getWeather = (cb) => {
  darksky
    .coordinates({lat: 48.922391, lng: 24.7140348})
    .units('si')
    .language('uk')
    .exclude('minutely,hourly')
    .get()
    .then( res => cb(res) )
    .catch((error) => console.log(error))
};


const getCurrentWeather = (cb) => {
  darksky
    .coordinates({lat: 48.922391, lng: 24.7140348})
    .units('si')
    .language('uk')
    .exclude('minutely,hourly,daily')
    .get()
    .then( res => cb(res) )
    .catch((error) => console.log(error))
}

module.exports = {
  getWeather,
  getCurrentWeather,
};