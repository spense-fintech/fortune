import express from "express";
import { errorResponse } from "./../commons/function.js";
const router = express.Router();
router.get("/:token", async (req, res) => {
  try {
    console.log("HEre");
    res.status(200).send({ data: req.params.token, count: 1 });
  } catch (err) {
    errorResponse(res, err);
  }
});
export default router;
