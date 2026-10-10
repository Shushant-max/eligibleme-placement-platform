import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { INITIAL_OPPORTUNITIES } from './data/opportunities.js';
import AppLayout from './components/AppLayout.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Opportunities from './pages/Opportunities.jsx';
import EligibilityChecker from './pages/EligibilityChecker.jsx';
import SkillMatch from './pages/SkillMatch.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  const [theme, setTheme] = useLocalStorage('eligibleme_theme', 'light');
  const [profile, setProfile] = useLocalStorage('eligibleme_profile', {});
  const [opportunities, setOpportunities] = useLocalStorage(
    'eligibleme_opportunities',
    INITIAL_OPPORTUNITIES
  );
  const [history, setHistory] = useLocalStorage('eligibleme_history', []);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppLayout
              theme={theme}
              toggleTheme={toggleTheme}
              profile={profile}
            />
          }
        >
          <Route
            index
            element={
              <Dashboard
                profile={profile}
                setProfile={setProfile}
                opportunities={opportunities}
                history={history}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <Dashboard
                profile={profile}
                setProfile={setProfile}
                opportunities={opportunities}
                history={history}
              />
            }
          />
          <Route
            path="profile"
            element={
              <Profile
                profile={profile}
                setProfile={setProfile}
              />
            }
          />
          <Route
            path="opportunities"
            element={
              <Opportunities
                opportunities={opportunities}
              />
            }
          />
          <Route
            path="checker"
            element={
              <EligibilityChecker
                profile={profile}
                opportunities={opportunities}
                history={history}
                setHistory={setHistory}
              />
            }
          />
          <Route
            path="skills"
            element={
              <SkillMatch
                profile={profile}
                opportunities={opportunities}
              />
            }
          />
          <Route
            path="history"
            element={
              <History
                history={history}
                setHistory={setHistory}
              />
            }
          />
          <Route
            path="settings"
            element={
              <Settings
                theme={theme}
                setTheme={setTheme}
                profile={profile}
                setProfile={setProfile}
                opportunities={opportunities}
                setOpportunities={setOpportunities}
                history={history}
                setHistory={setHistory}
              />
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
