import { db, model } from "mysql-model-router";

const datasource = model(
  db,
  "datasource",
  {
    datasource_id: "required|integer",
    name: "required|string",
    type: "required|string",
    config: "required|string",
  },
  "datasource_id",
  ["name"]
);

const api = model(
  db,
  "api",
  {
    api_id: "required|integer",
    datasource_id: "required|integer",
    slug: "required|string",
    method: "required|string",
    query: "required|string",
    description: "required|string",
    override: "required|string",
  },
  "api_id",
  ["datasource_id", "slug", "method"]
);

export { datasource, api };
