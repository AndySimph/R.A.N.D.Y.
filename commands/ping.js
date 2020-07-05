//ping command
exports.run = (bot, message, args, ops, func) => {

  func.ping(message.channel);

}
