const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Mobile", price: 10000 },
    { id: 2, name: "Clothes", price: 2000 }
  ]);
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});