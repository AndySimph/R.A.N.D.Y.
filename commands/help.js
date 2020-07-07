//Library/ Variables
const fs = require('fs');

//Command list command
exports.run = (bot, message, args, ops, func) => {
  //Set Variable
  var commandList = fs.readFileSync((`./commands.txt`), `utf8`);

  //Output
  func.hook(message.channel, 'R.A.N.D.Y.', commandList, '5A35B8', 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png');
}
