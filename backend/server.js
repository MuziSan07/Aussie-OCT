// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


// Routes
import authRoutes from "./routes/authRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import questionRoutes from "./routes/question.js";
import practiceRoutes from "./routes/practice.js";
import quizRoutes from "./routes/quiz.js";
import stimulationRoutes from "./routes/stimulationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRouter.js"; // NEW USER ROUTES
import flaggedRoutes from "./routes/flagged.js";
import overviewRoutes from "./routes/overview.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================
// Routes
// =====================

// 1. Chapters
app.use("/api/chapters", chapterRoutes);

// 2. Practice (student test list)
app.use("/api/practice", practiceRoutes);

// 3. Questions (admin + test engine)
app.use("/api/questions", questionRoutes);

// 4. Auth (login, register)
app.use("/api/auth", authRoutes);

// 5. Quiz
app.use("/api/quiz", quizRoutes);

// 6. Stimulation Test
app.use("/api/stimulation-test", stimulationRoutes);

// 7. Profile
app.use("/api/profile", profileRoutes);

// 8. Users (NEW - Admin Users Management)
app.use("/api/users", userRoutes);

// =====================
// Test & Health
// =====================
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});


app.use("/api/flagged", flaggedRoutes);

app.use("/api/overview", overviewRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send(`
    <h1>Australian Citizenship MERN Backend</h1>
    <p>API is running!</p>
    <ul>
      <li><a href="/api/test">/api/test</a></li>
      <li><a href="/api/chapters">/api/chapters</a></li>
      <li><a href="/api/practice">/api/practice</a></li>
      <li><a href="/api/questions/count?chapterId=1">/api/questions/count?chapterId=1</a></li>
      <li><a href="/api/users">/api/users</a> (NEW)</li>
      <li><a href="/api/users/stats">/api/users/stats</a> (NEW)</li>
    </ul>
  `);
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Test route: http://localhost:${PORT}/api/test`);
  console.log(`Chapters: http://localhost:${PORT}/api/chapters`);
  console.log(`Practice: http://localhost:${PORT}/api/practice`);
  console.log(`Questions: http://localhost:${PORT}/api/questions`);
  console.log(`Auth: http://localhost:${PORT}/api/auth`);
  console.log(`Profile: http://localhost:${PORT}/api/profile`);
  console.log(`Users: http://localhost:${PORT}/api/users (NEW)`);
  console.log(`Uploads: http://localhost:${PORT}/uploads\n`);
});