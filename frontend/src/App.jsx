import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminChapter from "./pages/AdminChapter";
import AddChapter from "./pages/AddChapter"; // ← ADDED THIS LINE
import EditChapter from "./pages/EditChapter";
import QuestionsList from "./pages/QuestionsList";
import AddQuestion from "./pages/AddQuestion";
import EditQuestion from "./pages/EditQuestion";
import PracticeTest from "./pages/PracticeTest"; // ADD THIS
import ChapterPractice from "./pages/ChapterPractice";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import SimulationTest from "./pages/SimulationTest";
import ProfilePage from "./pages/ProfilePage"; // ← Add this import
import UsersPage from "./pages/UsersPage";
import FlaggedQuestionsPage from "./pages/FlaggedQuestionsPage";
import UserOverview from "./pages/UserOverview";   // <-- IMPORT IT
import AdminOverview from "./pages/AdminOverview";   // ← Add this import


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />


        <Route path="/admin/chapter" element={<AdminChapter />} />
        <Route path="/admin/chapter/add" element={<AddChapter />} /> {/* ← NEW ROUTE ADDED */}
        <Route path="/admin/chapter/edit/:id" element={<EditChapter />} />
        <Route path="/admin/questions" element={<QuestionsList />} />
        <Route path="/admin/question/add" element={<AddQuestion />} />
        <Route path="/admin/question/edit/:id" element={<EditQuestion />} />
        

        {/* Student Practice */}
        <Route path="/practice" element={<PracticeTest />} />
        {/* <Route path="/practice/chapter/:id" element={<ChapterPractice />} /> */}
        <Route path="/practice/chapter/:id" element={<ChapterPractice />} />

        <Route path="/practice/test/:chapterId" element={<TestPage />} /> {/* ADD THIS */}
        <Route path="/practice/results" element={<ResultsPage />} />
        <Route path="/practice/simulation" element={<SimulationTest />} />

        
        <Route path="/practice/flagged" element={<FlaggedQuestionsPage />} />

        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/user-overview" element={<UserOverview />} />
        <Route path="/admin" element={<AdminOverview />} />
                {/* Profile Route */}


      </Routes>
    </Router>
  );
}

export default App;