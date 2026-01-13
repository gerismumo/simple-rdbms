import { ENV } from "./shared/config/env";
import app from "./app";

app.listen(ENV.PORT, ENV.HOST_NAME, () => {
  console.log(
    `Server running at http://${ENV.HOST_NAME}:${ENV.PORT} [${ENV.NODE_ENV}]`
  );
});
