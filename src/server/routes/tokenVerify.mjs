import express from "express";
import { errorResponse } from "./../commons/function.js";
const router = express.Router();
router.get("/api/auth/:token", async (req, res) => {
  try {
  } catch (err) {
    errorResponse(res, err);
  }
});
export default router;
