exports.run = async (bot, message, args, ops, func) => {
  //Delete user message
  message.delete();

  //Variables
  let fetched = ops.active.get(message.guild.id);

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

  //Set the active
  ops.active.set(message.guild.id, fetched);

  //Output to chat
  func.hook(message.channel, "Note.bot", `Song skipped!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");

  //return the dispatcher
  return fetched.dispatcher.emit('finish');
}
