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
          <Route path="/details/:id" element={<WeekendDetails />} />
          <Route path="/update/:id" element={<WeekendUpdate />} />
          <Route path="/users" element={<Users />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
