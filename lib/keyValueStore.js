const redis = require("redis");

let client;

if(process.env.REDIS_URL) {
  client = redis.createClient({ url: process.env.REDIS_URL });
} else {
  client = redis.createClient();
}

const { promisify } = require("util");
const credentialsKey = "turn-credentials";

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const setCredentials = (username, password, expiry) => {
  return setAsync(credentialsKey, JSON.stringify({
    username,
    password,
    expiry
  }));
}

const fetchCredentials = async () => {
  const payload = await getAsync(credentialsKey);
  return JSON.parse(payload);
}

module.exports = {
  client,
  setCredentials,
  fetchCredentials,
}
