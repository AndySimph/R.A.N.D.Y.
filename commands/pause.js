exports.run = (bot, message, args, ops, func) => {
  //Variables
  let fetched = ops.active.get(message.guild.id);

  //Delete user message
  message.delete();

  //Check if there is any music playing
  if (!fetched) {
    func.hook(message.channel, "Note.bot", `There currently isn\'t any music playing!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Check if the user and bot are in the same channel
  if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
    func.hook(message.channel, "Note.bot", `You aren\'t in the same channel as Note!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Check if the music has been paused already
  if (fetched.dispatcher.paused) {
    func.hook(message.channel, "Note.bot", `Music is already paused`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Pause the music
  fetched.dispatcher.pause();
  func.hook(message.channel, "Note.bot", `${fetched.queue[0].songTitle} has been paused`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
}
