//Purge command
exports.run = (bot, message, args, ops, func) => {

  func.purge(message, args);

}
