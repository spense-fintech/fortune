import express from "express";
const router = express.Router();
import tokenVerify from "./tokenVerify.mjs";
router.use("/auth/:token", tokenVerify);
export default router;
function overrideParams(req, res, next) {
  req.query = { ...req.query, ...req.params };
  next();
}
