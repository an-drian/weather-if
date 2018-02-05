const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URL)
  .catch(error => { 
    console.log(error);
   });

const userSchema = Schema({
  firstName: String,
  lastName: String,
  telegramUserId: Number,
  time: String,
});

const User = mongoose.model('User', userSchema);

User.saveUser = function(data) {
  const user =  new this(data);
  user.save((error) => {
    if (error) {
      return new Error(error);
    }
  });
};

module.exports = {
  User,
};
