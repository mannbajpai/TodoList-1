exports.getDate = () => {
  today = new Date();
  options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return today.toLocaleDateString("en-IN", options);
}
exports.getDay = () => {
  today = new Date();
  options = {
    weekday: 'long'
  };
  return today.toLocaleDateString("en-IN", options);
}
