import { db, model } from "mysql-model-router";

const user = model(
  db,
  "user",
  {
    user_id: "required|integer",
    phone: "required|string",
    phone_country_code: "required|string",
    joined: "required|string",
    info: "required|string",
  },
  "user_id",
  ["phone"]
);

export { user };
