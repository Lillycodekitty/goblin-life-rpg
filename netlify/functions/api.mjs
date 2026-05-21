import serverless from "serverless-http";
import app from "../../artifacts/api-server/dist/src/app.mjs";

export const handler = serverless(app);
