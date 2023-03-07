import ses from "node-ses";
const mail = ses.createClient({
  key: process.env.AWS_SES_KEY,
  secret: process.env.AWS_SES_SECRET,
  amazon: process.env.AWS_SES_URL,
});
export default mail;
