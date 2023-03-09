import express from "express";
import { errorResponse } from "./../commons/function.js";
import jwt from "jsonwebtoken";
import { existsSync } from "node:fs";
const router = express.Router();
// const jwt = require("jsonwebtoken");
router
  .get("/test", async (req, res) => {
    const token = jwt.sign(
      {
        phone_country_code: "+91",
        phone: "9999991111",
        email: "test@spense.money",
        gender: "Male",
        age: "20",
        income: "50000",
      },
      process.env.CLIENT_KEY,
      {
        algorithm: "HS256",
        header: { typ: "JWT", kid: process.env.CLIENT_ID },
        expiresIn: 300,
      }
    );
    try {
      res.redirect("http://localhost:3000/api/auth/token/" + token);
      //res.status(200).send({ url: "http://localhost:3000/api/auth/" + token });
    } catch (err) {
      errorResponse(res, err);
    }
  })
  .get("/token/:token", async (req, res) => {
    let credentials = {};
    if (existsSync("./client.json")) {
      credentials = require("./client.json");
    } else {
      const CLIENT_ID = process.env.CLIENT_ID || "";
      const CLIENT_KEY = process.env.CLIENT_KEY || "";
      if (CLIENT_ID !== "" && CLIENT_KEY !== "") {
        credentials[CLIENT_ID] = CLIENT_KEY;
      }
    }
    let token = req.params.token;
    let kid = "";
    try {
      kid = JSON.parse(Buffer.from(token.toString().split(".")[0], "base64"))[
        "kid"
      ];
    } catch (err) {
      res
        .status(401)
        .send({ message: "kid must be passed in the JsonWebToken header" });
    }
    jwt.verify(
      req.params.token,
      credentials[kid],
      async function (err, payload) {
        if (err || payload === undefined) {
          res.status(401).send({ message: "Unauthorized" });
        } else {
          try {
            if (Math.abs(payload.iat - new Date().getTime() / 1000) < 300) {
              //user checked
              const result = await checkLogin(req, payload);
              //console.log(result);
              //console.log(payload);
              res.redirect("/splash");
              //res.status(200).send({ message: "Session Saved" });
            } else {
              res.status(401).send({ message: "Token Expired" });
            }
          } catch (_err) {
            res.status(401).send({ message: "Invalid Token" });
          }
        }
      }
    );
  })

  /*.post("/", async (req, res) => {
    const token = jwt.sign(req.body.user, process.env.CLIENT_KEY, {
      algorithm: "HS256",
      header: { typ: "JWT", kid: process.env.CLIENT_ID },
    });
    try {
      //res.redirect("http://localhost:3000/api/auth/" + token)
      res.status(200).send({ url: "http://localhost:3000/api/auth/" + token });
    } catch (err) {
      errorResponse(res, err);
    }
  })*/

  .get("/session", async (req, res) => {
    res.send(req.session);
  });

async function checkLogin(req, token) {
  console.log(token);
  const user = await db.query("SELECT * FROM user WHERE phone = ?", [
    token.phone,
  ]);
  if (user.length > 0) {
    req.session.user = user[0];
  } else {
    // await user.find[phone = token.phone]
    await db.query("INSERT INTO user (phone, info) VALUES (?,?)", [
      token.phone,
      JSON.stringify({
        basic_details: {
          full_name: token.name,
          gender:
            token.gender === "Male"
              ? "M"
              : token.gender === "Female"
              ? "F"
              : "O",
          mobile_number: token.phone,
          email: token.email,
          date_of_birth: "",
          marital_status: "",
          annual_income: "",
        },
        address: {
          city: "",
          state: "",
          country: "",
          pin: "",
          landmark: "",
          address_line_1: "",
        },
        identification: {
          pan_number: "",
          aadhar_number: "",
        },
        bank_account: {
          name: "",
          account_number: "",
          account_type: "",
          ifsc_code: "",
        },
      }),
    ]);
    const user = await db.query("SELECT * FROM user WHERE phone = ?", [
      token.phone,
    ]);
    req.session.user = user[0];
  }
}

export default router;
