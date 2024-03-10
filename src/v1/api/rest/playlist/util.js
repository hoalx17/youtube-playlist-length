const moment = require("moment");

const dayStringFromMilliseconds = (ms) => {
  const days = Math.floor(moment.duration(ms).asDays());
  const hours = Math.floor(24 * (moment.duration(ms).asDays() - days));
  const minutes = Math.floor(60 * (24 * (moment.duration(ms).asDays() - days) - hours));
  const seconds = Math.ceil(60 * (60 * (24 * (moment.duration(ms).asDays() - days) - hours) - minutes));
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`;
};

module.exports = {
  dayStringFromMilliseconds,
};
