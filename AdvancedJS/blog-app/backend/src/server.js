const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { connectDB } = require("./config/database");
const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
