import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Welcome from './components/componentsAuthentication/Welcome';
import QuizSelector from './components/componentsQuiz/QuizSelector';
import BeginnerQuiz from './components/componentsQuiz/BeginnerQuiz';
import ExperiencedQuiz from './components/componentsQuiz/ExperiencedQuiz';
import LoadingScreen from './components/componentsQuiz/LoadingScreen';
import SkiMap from './components/SkiMap';
import ResortList from './components/ResortList';
import Dashboard from './components/componentsDashboard/Dashboard';
import Login from './components/componentsAuthentication/Login';
import CreateAccount from './components/componentsAuthentication/CreateAccount';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Welcome />
            </motion.div>
          } />
          <Route path="/quiz" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuizSelector />
            </motion.div>
          } />
          <Route path="/quiz/beginner" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BeginnerQuiz />
            </motion.div>
          } />
          <Route path="/quiz/experienced" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExperiencedQuiz />
            </motion.div>
          } />
          <Route path="/loading" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingScreen />
            </motion.div>
          } />
          <Route path="/results" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkiMap />
            </motion.div>
          } />
          <Route path="/resorts" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResortList />
            </motion.div>
          } />
          <Route path="/dashboard" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          } />
          <Route path="/login" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          } />
          <Route path="/create-account" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreateAccount />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;