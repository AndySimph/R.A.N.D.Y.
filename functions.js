//Libraries
const fs = require('fs')
const ytdl = require('ytdl-core');

module.exports = {
  //Ping function
  ping: function(channel) {
    channel.send('Pong!');
  },

  //Pong function
  pong: function(channel) {
    channel.send('Ping!');
  },

  //Purge function
  purge: async function(message, args) {
    //Checks if the user has the role
    if (!message.member.roles.cache.some(role => role.name === "King Bee")) {
      message.channel.send('You need the \`King Bee\` role to use this command.');
      return;
    }

    //Checks if argument is numerical
    if (isNaN(args[0])) {
      message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>');
      return;
    }

    //Finds and purges
    const fetched = await message.channel.messages.fetch({limit: args[0]});
    console.log(fetched.size + ' messages found, deleting...');

    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send('Error: ${error}'));
  },

  //Hook function
  hook: function(channel, title, message, color, avatar) {
    //Reassign default parameters
    if (!channel) {
      return console.log('Channel not specified.');
    }
    if (!title) {
      return console.log('Title not specified.');
    }
    if (!message) {
      return console.log('Message not specified.');
    }
    if (!color) {
      color = 'd9a744';
    }
    if (!avatar) {
      avatar = 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png';
    }

    //Remove spaces from color & url
    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g, '');

    //Retrieves webhooks of the channel
    channel.fetchWebhooks()
      .then(webhook => {
        // Fetches the webhook we will use for each hook
        let foundHook = webhook.first();

        // This runs if the webhook is not found.
        if (!foundHook) {
          //Creates webhook
          channel.createWebhook('R.A.N.D.Y.', 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png')
            webhook.send('', {
              "username": title,
              "avatarURL": avatar,
              "embeds": [{
                "color": parseInt(`0x${color}`),
                "description":message
                }]
              })
            .catch(error => {
              console.log(error);
              return channel.send('**Something went wrong when sending the webhook. Please check console.**');
            })
        } else {
          //Uses existing webhook to send
          foundHook.send('', {
            "username": title,
            "avatarURL": avatar,
            "embeds": [{
              "color": parseInt(`0x${color}`),
              "description":message
            }]
          })
          .catch(error => {
            console.log(error);
            return channel.send('**Something went wrong when sending the webhook. Please check console.**');
          })
        }
      })
    },

  //get random line from file function
  getRandomLine: async function(message, fileName, func, callback) {
    //read file
    fs.readFile(fileName, function(err, data) {
      //Error handling
      if(err) {
        return message.channel.send("Uh-Oh");
      }

      //set quote variable and split quotes into lines variable
      var quote = fs.readFileSync(fileName, `utf8`);
      var lines = quote.split(`\n`);

      //Return random quote
      return lines[Math.floor(Math.random()*lines.length)];
      //func.hook(message.channel, "JOJO", lines[Math.floor(Math.random()*lines.length)], "C52C2C", "https://avatarfiles.alphacoders.com/161/161288.png");
    })
  },

  //Play command
  p: async function(bot, message, args, ops, func) {
    //variable
    const voiceChannel = message.member.voice.channel;

    //Check if the user is in a voice channel and if the bot is a different voice channel
    if (!voiceChannel) {
      func.hook(message.channel, "Note.bot", `You need to be in a voice channel to play music!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
      return;
    }

    //Check if it is a valid url
    if (!args[0]) {
      func.hook(message.channel, "Note.bot", `Please enter a url`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
      return;
    }
    let validate = await ytdl.validateURL(args[0]);
    if (!validate) {
      func.hook(message.channel, "Note.bot", `Please enter a valid url`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
      return;
    }

    //get song info
    let info = await ytdl.getInfo(args[0]);

    //Set data
    let data = ops.active.get(message.guild.id) || {};

    //Check connection and queue
    if (!data.connection) {
      data.connection = await message.member.voice.channel.join();
    }
    if (!data.queue) {
      data.queue = [];
    }

    data.guildID = message.guild.id;

    //set song info in queue
    data.queue.push({
      songTitle: info.title,
      requester: message.author,
      url: args[0],
      announceChannel: message.channel.id
    })

    //Output what is playing
    if (!data.dispatcher) {
      func.play(bot, message, ops, data, func);
    } else {
      func.hook(message.channel, "Note.bot", `Added to the queue: ${info.title} | Requested by: ${message.author}`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    }

    ops.active.set(message.guild.id, data);
  },

  //Play through queue function
  play: async function(bot, message, ops, data, func) {
    func.hook(message.channel, "Note.bot", `Now playing: ${data.queue[0].songTitle} | Requested by: ${data.queue[0].requester}`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");

    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, {filter: 'audioonly'}));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once('finish', function() {
      func.finish(bot, message, ops, this, func);
    })
  },

  //Finish function
  finish: function(bot, message, ops, dispatcher, func) {
    let fetched = ops.active.get(dispatcher.guildID);

    fetched.queue.shift();

    if (fetched.queue.length > 0) {
      ops.active.set(dispatcher.guildID, fetched);

      func.play(bot, message, ops, fetched, func);
    } else {
      ops.active.delete(dispatcher.guildID);

      let vc = bot.guilds.cache.get(dispatcher.guildID).voice.channel;

      if (vc) {
        vc.leave();
        func.hook(message.channel, "Note.bot", `Now leaving`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
      }
    }
  },

  //Kill command
  kill: function(bot, message, args, ops, func) {

    //Clear the queue
    ops.active.clear();

    //variable
    const voiceChannel = message.member.voice.channel;

    //Check if the user is in a voice channel and if the bot is a different voice channel
    if (!voiceChannel) {
      return message.channel.send("You need to be in a voice channel!");
    }

    //Check if the bot and user are in the same Channel
    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) {
      return message.channel.send('You are not in the channel as the bot');
    }

    //Leave Channel
    message.guild.me.voice.channel.leave();

    //Output message
    func.hook(message.channel, "Note.bot", `Now leaving, Bye`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
  }

}
