/*
const queue = new Map();
const ytdl = require('ytdl-core');
const search = require('yt-search');

//Read message
client.on('message', async message => {

  //Check for command to execute for music
  const serverQueue = queue.get(message.guild.id);

  //Check command types

  //skip command
  } else if (message.content.startsWith(`${prefix}skip`)) {
      skip(message, serverQueue);
      return;

  //kill command
  } else if (message.content.startsWith(`${prefix}kill`)) {
      kill(message, serverQueue);
      return;

  //search command
  } else if (message.content.startsWith(`${prefix}se`)) {
      const voiceChannel = message.member.voice.channel;
      let command = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);

      //return message.channel.send(command);
      search(command, function(err, results) {
        //Error statement
        if(err) return message.channel.send("Uh-Oh");

        //set amount of videos and define resp
        let videos = results.videos.slice(0,10);
        let resp = '';

        //Create variable containing the list
        for (var i in videos) {
          resp += `**[${parseInt(i)+1}]:**\`${videos[i].title}\`\n`;
        }
        resp += `\n**Choose a number between \`1-${videos.length}\``;

        //Output list of available videos
        message.channel.send(resp);

        const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
        const collector = message.channel.createMessageCollector(filter);

        //Update collector variable
        collector.videos=videos;

        //create listener event
        collector.once('collect', function(m) {
          //Replace old message with new message to play selected video
          message.content = `:}play `+[this.videos[parseInt(m.content)-1].url]
          //Run play command, passing url as args.
          execute(message, serverQueue);
        });
      });

    return;
  } else {
    message.channel.send("You stupid, you don't know the command!");
  }
});

//Skip Function
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

//Stop Function
function kill(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("Ha, you can't kill me!");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  return message.channel.send(`Ack!`);
}

*/
// Run dotenv
require('dotenv').config();

//Libraries
const Discord = require('discord.js');
const bot = new Discord.Client();
const {prefix, token} = require('./config.json');
//const queue = new Map();
// const ytdl = require('ytdl-core');
//const search = require('yt-search');

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

  //const serverQueue = queue.get(message.guild.id);
  //console.log(serverQueue);

  //Command Handler
  try {
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(bot, message, args, func);

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
