const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AfriHealth Backend API' });
});

require("dotenv").config();

require("./config/db");

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/hospitals", require("./routes/hospital"));
app.use("/appointments", require("./routes/appointment"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});