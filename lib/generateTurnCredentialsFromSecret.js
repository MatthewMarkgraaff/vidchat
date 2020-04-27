const crypto = require('crypto');

const getTURNCredentials = (name = "CHATSERVICE") => {
  //valid credentials for 4 hours
  let unixTimeStamp = parseInt(Date.now() / 1000) + 4*3600,
    username = [unixTimeStamp, name].join(':'),
    password,
    hmac = crypto.createHmac('sha1', process.env.TURN_SECRET);

  hmac.setEncoding('base64');
  hmac.write(username);
  hmac.end();
  password = hmac.read();

  return {
    username,
    password,
    expiry: unixTimeStamp,
  };
}

module.exports = getTURNCredentials;
