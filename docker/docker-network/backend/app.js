const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Backend Container" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});