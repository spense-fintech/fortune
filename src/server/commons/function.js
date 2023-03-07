import crypto from "crypto";
import { Validator } from "node-input-validator";
function isset(accessor) {
  return typeof accessor !== "undefined";
}
function generateAuthCode(len) {
  return crypto
    .randomBytes(len)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, len);
}

function generateOtp() {
  if (process.env.SBM_S2S_MOCK === "true") {
    return "123456";
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function jsonSafeParse(obj) {
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (err) {
      return obj;
    }
  } else if (typeof obj === "object") {
    for (const i in obj) {
      obj[i] = jsonSafeParse(obj[i]);
    }
    return obj;
  } else {
    return obj;
  }
}
function arrayToObj(arr, key) {
  let response = {};
  if (!Array.isArray(key)) {
    key = [key];
  }
  for (let i in arr) {
    let key_value = get_key_value_recursive(arr[i], key);
    if (key_value == null) return {};
    else response[key_value] = arr[i];
  }
  return response;
}
function get_key_value_recursive(data, key) {
  if (key.length == 1) {
    if (data.hasOwnProperty(key[0])) return data[key[0]];
    else return null;
  } else {
    if (data.hasOwnProperty(key[0])) {
      return get_key_value_recursive(data[key[0]], key.slice(1));
    } else return null;
  }
}
function valueArray(items, attribute) {
  const result = [];
  for (let i in items) {
    result.push(items[i][attribute]);
  }
  return result;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function arrayStringCheck(x) {
  if (Array.isArray(x)) return x.every((i) => typeof i === "string");
  else return false;
}
const encrypt = (val) => {
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    process.env.PARTNER_ENCRYPTION_KEY,
    process.env.PARTNER_ENCRYPTION_IV
  );
  const encrypted = Buffer.concat([cipher.update(val, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([encrypted, tag]).toString("base64");
};
const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    process.env.PARTNER_ENCRYPTION_KEY,
    process.env.PARTNER_ENCRYPTION_IV
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  //removing authTag from the decrypted text
  return decrypted.substring(0, decrypted.length - 16);
};

function errorResponse(res, err) {
  global.logger.error(err);
  let message = "";
  if (err.hasOwnProperty("sqlMessage") && err.sqlMessage)
    message = err.sqlMessage;
  else if (err.hasOwnProperty("message") && err.message) message = err.message;
  else message = "unknown error: " + err.toString();
  res.status(500).send({ type: "danger", message });
}

async function validateInput(req, res, required) {
  for (const key in required) {
    if (req.hasOwnProperty(key)) {
      if (Array.isArray(req[key])) {
        res.status(422).send({
          message: "This service supports does not support array",
          type: "error",
        });
        return false;
      }
      let validator = new Validator(req[key], required[key]);
      const matched = await validator.check();
      if (!matched) {
        res.status(422).send({
          message: getErrorMessage(key, validator.errors),
          type: "error",
        });
        return false;
      }
    }
  }
  return true;
}

function getErrorMessage(key, errors) {
  let message = `In ${key}: `;
  for (const i in errors) {
    if (errors.hasOwnProperty(i)) {
      message = message + (message !== "" ? " " : "");
      message = message + errors[i].message;
    }
  }
  return message;
}

function isEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    email
  );
}

export {
  isset,
  generateAuthCode,
  generateOtp,
  jsonSafeParse,
  valueArray,
  arrayToObj,
  sleep,
  arrayStringCheck,
  errorResponse,
  encrypt,
  decrypt,
  validateInput,
  isEmail,
};
