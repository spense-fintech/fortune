import Prometheus from "prom-client";
const setupMetrics = (app, prefix) => {
  const register = new Prometheus.Registry();
  register.setDefaultLabels({
    application: "ups",
  });
  Prometheus.collectDefaultMetrics({ register });
  app.get(prefix + "/metrics", (req, res) => {
    res.set("Content-Type", Prometheus.register.contentType);
    register.metrics().then((result) => {
      res.send(result);
    });
  });
};
export { setupMetrics };
