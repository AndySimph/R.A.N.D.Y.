//Purge command
exports.run = (bot, message, args, ops, func) => {

  //call purge function
  func.purge(message, args);
}
