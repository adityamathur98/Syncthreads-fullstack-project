const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

const User = require("./models/user");
const Dashboard = require("./models/dashboard");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5001;

const initializeDBandServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Atlas Connected");
  } catch (error) {
    console.log("MongoDb Connection Error: ", error);
    process.exit(1);
  }
};

initializeDBandServer();

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});

const validatePassword = (password) => {
  return password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password);
};

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    return response.status(401).json({ error: "Missing Authorization Header" });
  }

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) {
    return response.status(401).json({ error: "Token Missing" });
  }

  jwt.verify(jwtToken, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return response.status(401).json({ error: "Invalid JWT Token" });
    }
    request.user = payload;
    next();
  });
};

//Register New User Api
app.post("/api/register", async (request, response) => {
  try {
    const { username, name, password, gender, location } = request.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return response.status(400).json({ error: "User Already Exists!" });
    }

    if (!validatePassword(password)) {
      return response.status(400).json({
        error:
          "Password must be at least 6 Characters long, contain one Uppercase letter and One Number.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      password: hashedPassword,
      gender,
      location,
    });

    await newUser.save();
    response.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error("Error in Registration: ", error);
    response
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

//Login Api
app.post("/api/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });

    if (!user) {
      return response.status(401).json({ error: "Invalid User" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return response.status(401).json({ error: "Invalid Password" });
    }

    const payload = { username: user.username, id: user._id };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return response.json({ message: "Login Successful", jwtToken });
  } catch (error) {
    console.error("Login Error: ", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

//Get Dashboard Api
app.get("/api/dashboard", authenticateToken, async (request, response) => {
  try {
    const dashboardData = await Dashboard.find({});

    if (dashboardData.length === 0) {
      return response.status(404).json({ error: "No Data Available" });
    }
    response.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

//Get Map Api
app.get("/api/map", authenticateToken, async (request, response) => {
  try {
    const mapData = {
      center: [20.5937, 78.9629],
      zoom: 5,
      message: "Welcome to India Map!",
    };
    response.status(200).json(mapData);
  } catch (error) {
    console.error("Error Fetching map data: ", error);
    response.status(500).json({ error: "Internal server error" });
  }
});
