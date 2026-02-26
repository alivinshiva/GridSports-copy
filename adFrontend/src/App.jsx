import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminGridDashboard from './components/AdminGridDashboard';
import WeeklyDetails from './components/WeekendDetails'; // Verify typo 'WeeklyDetails' vs 'WeekendDetails' import logic if needed
import WeekendForm from './components/WeekendForm';
import WeekendDetails from './components/WeekendDetails';
import WeekendUpdate from './components/WeekendUpdate';
import Users from './components/Users';
import Challenges from './components/Challenges';
import ChallengeForm from './components/ChallengeForm';
import Welcome from './components/Welcome';
import AllWeekends from './components/AllWeekends';
import SubmissionForm from './components/SubmissionForm';
import ChallengeDetails from './components/ChallengeDetails';
import AllHeroes from './components/AllHeroes';
import HeroForm from './components/HeroForm';
import HeroUpdate from './components/HeroUpdate';
import TribePointsForm from './components/TribePointsForm';
import Tags from './components/Tags';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/weekends" element={<AllWeekends />} />
          <Route path="/add" element={<WeekendForm />} />
          <Route path="/add-challenge" element={<ChallengeForm />} />
          <Route path="/add-submission" element={<SubmissionForm />} />
          <Route path="/weekend/details/:id" element={<WeekendDetails />} />
          <Route path="/update/:id" element={<WeekendUpdate />} />
          <Route path="/users" element={<Users />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge-details/:id" element={<ChallengeDetails />} />
          <Route path="/heroes" element={<AllHeroes />} />
          <Route path="/add-hero" element={<HeroForm />} />
          <Route path="/update-hero" element={<HeroUpdate />} />
          <Route path="/manage-tribe-points" element={<TribePointsForm />} />
          <Route path="/tags" element={<Tags />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
