async function request(
  url,
  method,
  body = null,
  contentType = "application/json",
  headers = {}
) {
  headers["Content-Type"] = contentType + ";charset=utf-8";
  return window
    .fetch(url, {
      method,
      body: body != null ? JSON.stringify(body) : null,
      headers,
    })
    .then((res) => res.json())
    .then((data) => {
      try {
        if (data.hasOwnProperty("message")) {
          //alert(data.message);
          window.toast("", data.message, data.type);
        }
      } catch (err) {}
      return data;
    })
    .catch((err) => {
      throw err;
    });
}
function handleSubmit(e, callback) {
  const method = e.target.getAttribute("method") || e.target.method;
  const encType = e.target.getAttribute("encType") || e.target.enctype;
  const body = {};
  for (let field of new FormData(e.target)) {
    body[field[0]] = field[1];
  }
  request(e.target.action, method, body, encType)
    .then((res) => {
      callback(res, null);
    })
    .catch((err) => {
      callback(null, err);
    });
}
//function uploadFile(url, method, body, headers = {}) {}
module.exports = {
  request,
  handleSubmit,
};
