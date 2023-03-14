import express, { response } from "express";
import { errorResponse } from "../commons/function.js";
const router = express.Router();
import { user } from "../models/index.mjs";
// const jwt = require("jsonwebtoken");
router
  .put("/", async (req, res) => {
    // res.send(req.body);
    user
      .update(req.body)
      .then((response) => {
        req.session.user = response;
        res.send(response);
      })
      .catch((err) => {
        errorResponse(res, err);
      });
  })
  .get("/:user_id", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM user WHERE user_id=?", [
        req.params.user_id,
      ]);
      const user = result[0];
      req.session.user = user;
      res.send({ user: user });
    } catch (err) {
      errorResponse(res, err);
    }
  });

export default router;
