import sessions from "express-session";
import { MemoryStore } from "express-session";
import RedisConnection from "connect-redis";
const RedisStore = RedisConnection(sessions);
import redis from "redis";
global.store = null;
if (process.env.REDIS_HOST !== "" && process.env.REDIS_PORT !== "") {
  const client = redis.createClient({
    legacyMode: true,
    url:
      "redis://default:" +
      process.env.REDIS_PASSWORD +
      "@" +
      process.env.REDIS_HOST +
      ":" +
      process.env.REDIS_PORT,
  });
  client.on("error", function (err) {
    console.log(
      "Could not establish a connection with redis for session. " + err
    );
  });
  client.on("connect", function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Session managed through RedisStore");
  });
  client.connect().catch(console.error);
  global.store = new RedisStore({
    client,
  });
} else {
  global.store = new MemoryStore();
  console.log("Session managed through MemoryStore");
}
const setupSession = (app) => {
  app.use(
    sessions({
      store: global.store,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure:
          (process.env.NODE_ENV === "production") === "false" ? true : false, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 * 2 * 7, // session max age in miliseconds
      },
    })
  );
};
export default setupSession;
