import express from "express";
const router = express.Router();
import tokenVerify from "./tokenVerify.mjs";
import userAuth from "./userAuth.mjs";
router.use("/auth", tokenVerify);
router.use("/userAuth", userAuth);
export default router;
function overrideParams(req, res, next) {
  req.query = { ...req.query, ...req.params };
  next();
}
