//Volume command
exports.run = (bot, message, args, ops, func) => {
  //Variable
  let fetched = ops.active.get(message.guild.id);

  //Delete user message
  message.delete();

  //Check if there is any music playing
  if (!fetched) {
    func.hook(message.channel, "Note.bot", `There currently isn\'t any music playing!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Check if the bot and user are in the same channel
  if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
    func.hook(message.channel, "Note.bot", `You aren\'t in the same channel as Note!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Check if the input is between 0 and 200
  if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) {
    func.hook(message.channel, "Note.bot", `Volume must be inbetween 0-200`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  //Set Volume
  fetched.dispatcher.setVolume(args[0]/100);

  //Output message
  func.hook(message.channel, "Note.bot", `Volume set to ${args[0]}`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
}
