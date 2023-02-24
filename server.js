import { app } from "./app.js";
import { connectDB } from "./data/database.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(
    `server is listening on port : ${process.env.PORT}, ${process.env.NODE_ENV} Mode`
  );
});
