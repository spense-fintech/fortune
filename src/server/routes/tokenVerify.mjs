import express from "express";
import { errorResponse } from "./../commons/function.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
const router = express.Router();
router
  .get("/:token", async (req, res) => {
    try {
      res.status(200).send({ data: req.params.token, count: 1 });
    } catch (err) {
      errorResponse(res, err);
    }
  })
  .post("/", async (req, res) => {
    const token = sign(req.body.user, process.env.CLIENT_KEY, {
      algorithm: "HS256",
      header: { typ: "JWT", kid: process.env.CLIENT_ID },
    });
    try {
      res.status(200).send({ url: "http://localhost:3000/api/auth/" + token });
    } catch (err) {
      errorResponse(res, err);
    }
  });
export default router;
