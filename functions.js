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

  // Old play command
  // execute: async function(message, serverQueue, queue, func) {
  //   const args = message.content.split(" ");
  //   const voiceChannel = message.member.voice.channel;
  //   if (!voiceChannel)
  //     return message.channel.send("You need to be in a voice channel to play music!");
  //   const permissions = voiceChannel.permissionsFor(message.client.user);
  //   if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  //     return message.channel.send(
  //       "I need the permissions to join and speak in your voice channel!"
  //     );
  //   }
  //
  //   const songInfo = await ytdl.getInfo(args[1]);
  //   const song = {
  //     title: songInfo.title,
  //     url: songInfo.video_url
  //   };
  //
  //   if (!serverQueue) {
  //     const queueContruct = {
  //       textChannel: message.channel,
  //       voiceChannel: voiceChannel,
  //       connection: null,
  //       songs: [],
  //       volume: 5,
  //       playing: true
  //     };
  //
  //     queue.set(message.guild.id, queueContruct);
  //     queueContruct.songs.push(song);
  //
  //     try {
  //       var connection = await voiceChannel.join();
  //       queueContruct.connection = connection;
  //       func.play(message, message.guild, queueContruct.songs[0], queue, func);
  //     } catch (err) {
  //       console.log(err);
  //       queue.delete(message.guild.id);
  //       return message.channel.send(err);
  //     }
  //   } else {
  //     serverQueue.songs.push(song);
  //     return message.channel.send(`${song.title} has been added to the queue!`);
  //   }
  // },
  //
  // play: function(message, guild, song, queue, func) {
  //   const serverQueue = queue.get(guild.id);
  //   if (!song) {
  //     serverQueue.voiceChannel.leave();
  //     queue.delete(guild.id);
  //     return;
  //   }
  //
  //   const dispatcher = serverQueue.connection
  //     .play(ytdl(song.url))
  //     .on("finish", () => {
  //       serverQueue.songs.shift();
  //       func.play(message, guild, serverQueue.songs[0], queue, func);
  //     })
  //     .on("error", error => console.error(error));
  //   dispatcher.setVolumeLogarithmic(serverQueue.volume / 10);
  //   func.hook(message.channel, "Note.bot", `Start playing: **${song.title}**`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
  // },

  //Play command
  play: async function(bot, message, args, func) {
    //variable
    const voiceChannel = message.member.voice.channel;

    //Check if the user is in a voice channel and if the bot is a different voice channel
    if (!voiceChannel) {
      return message.channel.send("You need to be in a voice channel to play music!");
    }
    if (message.guild.me.voiceChannel) {
      return message.channel.send('Sorry, the bot is already connected somewhere');
    }

    // const permissions = voiceChannel.permissionsFor(message.bot.user);
    // if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    //   return message.channel.send("I need the permissions to join and speak in your voice channel!");
    // }

    //Check if it is a valid url
    if (!args[0]) {
      return message.channel.send('Please enter a url');
    }
    let validate = await ytdl.validateURL(args[0]);
    if (!validate) {
      return message.channel.send('Please enter a valid url');
    }

    //Get song info
    let info = await ytdl.getInfo(args[0]);

    //Connect to voice channel
    var connection = await message.member.voice.channel.join();

    //Play the song
    let dispatcher = await connection.play(ytdl(args[0], { filter: 'audioonly' }));

    //Output what is playing
    func.hook(message.channel, "Note.bot", `Now playing: ${info.title}`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
  },

  //Kill command
  kill: function(bot, message, args, func) {
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

    message.guild.me.voice.channel.leave();

    func.hook(message.channel, "Note.bot", `Now leaving`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");

  }

}
