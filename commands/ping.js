//ping command
exports.run = (bot, message, args, ops, func) => {

  //Call ping function
  func.ping(message.channel);
}
