import express, { response } from "express";
import { errorResponse } from "../commons/function.js";
const router = express.Router();
import { user } from "../models/index.mjs";
// const jwt = require("jsonwebtoken");
router.put("/", async (req, res) => {
  // res.send(req.body);
  user
    .update(req.body)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      errorResponse(res, err);
    });
});

export default router;
