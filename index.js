// Run dotenv
require('dotenv').config();

//Libraries
const Discord = require('discord.js');
const bot = new Discord.Client();
const {prefix, token} = require('./config.json');

//Variables
const ownerID = '297181637043683328';
const active = new Map();

//Listener Event: Runs whenever a message is received
bot.on('message', message => {

  //Variables
  let msg = message.content.toUpperCase();
  let sender = message.author;
  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift().toLowerCase();

  //check if the message is from the bot or without the prefix
  if (sender.bot) return;
  if (!message.content.startsWith(prefix)) return;

  //uses the functions file
  const func = require('./functions.js');
  console.log(func);

  //Command Handler
  try {
    let ops = {
      ownerID: ownerID,
      active: active
    }

    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(bot, message, args, ops, func);
  } catch(e) {
    console.log(e.message);
  } finally {
    console.log(`${message.author.username} ran the command: ${cmd}`);
  }
});

//Console log message
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});
bot.login(token);
