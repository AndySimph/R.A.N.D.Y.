//kill command
exports.run = (bot, message, args, ops, func) => {
  //Delete user message
  message.delete();

  //Call kill function
  func.kill(bot, message, args, ops, func);
}
