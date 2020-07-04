//Purge command
exports.run = (bot, message, args, func) => {

  func.purge(message, args);

}
