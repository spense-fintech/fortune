import express from "express";
import { errorResponse } from "./../commons/function.js";
const router = express.Router();
router.get("/session", async (req, res) => {
  try {
    res.status(200).send({ user: req.session.user });
  } catch (err) {
    errorResponse(res, err);
  }
});
export default router;
