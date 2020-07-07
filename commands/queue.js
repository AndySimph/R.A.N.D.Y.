//Queue commands
exports.run = async (bot, message, args, ops, func) => {
  //Delete user message
  message.delete();

  let fetched = ops.active.get(message.guild.id);

  if (!fetched) {
    func.hook(message.channel, "Note.bot", `There currently isn\'t any music!`, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
    return;
  }

  let queue = fetched.queue;
  let nowPlaying = queue[0];
  let resp = `Now Playing\n${nowPlaying.songTitle} ** -- ** Requested By: ${nowPlaying.requester}\n\n
              Queue:\n`;

  for (var i = 1; i < queue.length; i++) {
    resp += `${i}. ${queue[i].songTitle} ** -- ** Requested By: ${queue[i].requester}\n`;
  }

  func.hook(message.channel, "Note.bot", resp, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");

}
