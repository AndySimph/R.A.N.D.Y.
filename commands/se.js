//Search command
//Package
const search = require('yt-search');

exports.run = (bot, message, args, ops, func) => {
  search(args.join(' '), function(err, res) {
    //Error statement
    if(err) {
      func.hook(message.channel, "Note.bot", "Uh-Oh", "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");
      return;
    }

    //set amount of videos and define resp
    let videos = res.videos.slice(0,10);
    let resp = '';

    //Create variable containing the list
    for (var i in videos) {
      resp += `[${parseInt(i)+1}]:\`${videos[i].title}\`\n`;
    }
    resp += `\nChoose a number between \`1-${videos.length}\``;

    //Output list of available videos
    func.hook(message.channel, "Note.bot", resp, "14DBCE", "https://cdn.iconscout.com/icon/free/png-512/music-note-1-461900.png");

    const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
    const collector = message.channel.createMessageCollector(filter);

    collector.videos = videos;
    collector.once('collect', function(m) {
      // let commandFile = require('./p.js');
      // commandFile.run(bot, message, [this.videos[parseInt(m.content)-1].url], ops, func);
      func.p(bot, message, [this.videos[parseInt(m.content)-1].url], ops, func);
    });
  });
}
