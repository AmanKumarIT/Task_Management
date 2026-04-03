const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const startCronJobs = require("./utils/cronJobs");

dotenv.config();

const connectDB = require("./config/db");

connectDB();


const app = express();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskmanage07.netlify.app"
    ],
    credentials: true
  })
);
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

startCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
