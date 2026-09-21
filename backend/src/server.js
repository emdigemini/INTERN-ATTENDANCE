import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT =  process.env.PORT;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log('Server started on PORT: ', PORT));
  } catch (err) {
    console.log('Server failed to start: ', err);
    process.exit(1);
  }
})();
