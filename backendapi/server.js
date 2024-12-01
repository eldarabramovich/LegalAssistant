const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000; // פורט השרת שלך

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  req.url = req.url.trim(); // מסיר רווחים ותווים מיותרים
  next();
});

// טעינת הנתיב
const chatRoutes = require("./routes/gptcaller");
app.use("/api/", chatRoutes);
console.log("Chat route loaded.");
// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
