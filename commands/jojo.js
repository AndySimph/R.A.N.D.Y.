//Jojo command
//Libraries
const fs = require('fs')

exports.run = (bot, message, args, ops, func) => {
  //sete the jojoquotes.txt as a var
  var jojo = `./jojoquotes.txt`;

  //read file
  fs.readFile(jojo, function(err, data) {
    //Error handling
    if (err) {
      return message.channel.send("Uh-Oh");
    }

    //set quote variable and split quotes into lines variable
    var quote = fs.readFileSync(jojo, `utf8`);
    var lines = quote.split(`\n`);

    //Return random quote
    func.hook(message.channel, "JOJO", lines[Math.floor(Math.random()*lines.length)], "C52C2C", "https://avatarfiles.alphacoders.com/161/161288.png");
  })
}
