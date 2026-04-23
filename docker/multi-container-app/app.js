require("dotenv").config();

const express = require("express");
const { Client } = require("pg");

const app = express();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error:", err));

app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT NOW()");
    res.send(`DB Time: ${result.rows[0].now}`);
  } catch (err) {
    res.send("DB error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});