//Library/ Variables
const fs = require('fs');

//Command list command
exports.run = (bot, message, args, func) => {

  var commandList = fs.readFileSync((`./commands.txt`), `utf8`);
  message.channel.send(commandList)

}
