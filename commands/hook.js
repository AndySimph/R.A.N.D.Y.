//Hook commands
exports.run = (bot, message, args, ops, func) => {
  //Delete user message
  message.delete();

  //Split the user message into sections for the hook function
  let hookArgs = message.content.slice(6).split(",");

  //Call hook function
  func.hook(message.channel, hookArgs[0], hookArgs[1], hookArgs[2], hookArgs[3]);
}
