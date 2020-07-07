//pong command
exports.run = (bot, message, args, ops, func) => {

  //call pong function
  func.pong(message.channel);
}
